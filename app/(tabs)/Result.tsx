import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Appbar, Button, Card, MD3DarkTheme, Provider as PaperProvider, Paragraph, Title } from "react-native-paper";
import { analyzeImage, imageToBase64, PROMPTS } from "../../lib/gemini";

export default function ResultScreen() {
    const { photoUri, promptKey } = useLocalSearchParams<{ photoUri?: string; promptKey?: keyof typeof PROMPTS }>();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [resultData, setResultData] = useState<any>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!photoUri) {
            setError("No image provided.");
            setLoading(false);
            return;
        }

        const processImage = async () => {
            try {
                setLoading(true);
                setError("");

                // 1. Convert local file to base64
                const base64Data = await imageToBase64(photoUri);

                // 2. Analyze with Gemini
                const prompt = promptKey && PROMPTS[promptKey]
                    ? PROMPTS[promptKey]
                    : "Please analyze this image and describe what you see in detail. If there is text, read it. If there are objects, identify them.";
                const response = await analyzeImage(base64Data, prompt);

                // 3. Extract text from response
                const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

                try {
                    // Remove any markdown code blocks if the API included them
                    let cleanText = text.replace(/```json/gi, "").replace(/```/g, "").trim();
                    const parsed = JSON.parse(cleanText);
                    setResultData(parsed);
                } catch (e) {
                    // console.log("Failed to parse JSON, falling back to raw object", e);
                    setResultData({ raw: text });
                }

            } catch (err: any) {
                console.error(err);
                setError(err.message || "Something went wrong analyzing the image.");
            } finally {
                setLoading(false);
            }
        };

        processImage();
    }, [photoUri]);

    return (
        <PaperProvider theme={MD3DarkTheme}>
            <SafeAreaView style={styles.container}>
                <Appbar.Header style={styles.appBar}>
                    <Appbar.BackAction onPress={() => router.back()} color="#fff" />
                    <Appbar.Content title="Analysis Result" titleStyle={styles.title} />
                </Appbar.Header>

                <ScrollView contentContainerStyle={styles.content}>
                    {photoUri ? (
                        <Image
                            source={{ uri: photoUri }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    ) : null}

                    <View style={styles.resultContainer}>
                        {loading ? (
                            <View style={styles.centerContainer}>
                                <ActivityIndicator size="large" color="#fff" />
                                <Text style={styles.loadingText}>Analyzing image with Vision AI...</Text>
                            </View>
                        ) : error ? (
                            <View style={styles.errorContainer}>
                                <Title style={styles.errorTitle}>Oops! Something went wrong.</Title>
                                <Paragraph style={styles.errorDetail}>{error}</Paragraph>
                                <Button
                                    mode="contained"
                                    icon="refresh"
                                    onPress={() => router.back()}
                                    style={styles.retryButton}
                                    buttonColor="#FF3B30"
                                >
                                    Try Again
                                </Button>
                            </View>
                        ) : (
                            <View>
                                {resultData?.objects ? (
                                    <Card style={styles.card}>
                                        <Card.Content>
                                            <Title style={styles.cardTitle}>Objects Detected</Title>
                                            <View style={styles.tagsContainer}>
                                                {Array.isArray(resultData.objects) ? (
                                                    resultData.objects.length > 0 ? (
                                                        resultData.objects.map((obj: string, i: number) => (
                                                            <View key={i} style={styles.tag}>
                                                                <Text style={styles.tagText}>
                                                                    {obj.charAt(0).toUpperCase() + obj.slice(1)}
                                                                </Text>
                                                            </View>
                                                        ))
                                                    ) : (
                                                        <View style={styles.tag}>
                                                            <Text style={styles.tagText}>No object detected</Text>
                                                        </View>
                                                    )
                                                ) : (
                                                    <Text style={styles.tagText}>{resultData.objects ? resultData.objects : "No object detected"}</Text>
                                                )}
                                            </View>
                                        </Card.Content>
                                    </Card>
                                ) : null}

                                {resultData?.context ? (
                                    <Card style={styles.card}>
                                        <Card.Content>
                                            <Title style={styles.cardTitle}>Context</Title>
                                            <Paragraph style={styles.cardText}>{resultData.context}</Paragraph>
                                        </Card.Content>
                                    </Card>
                                ) : null}

                                {resultData?.activities ? (
                                    <Card style={styles.card}>
                                        <Card.Content>
                                            <Title style={styles.cardTitle}>Activities</Title>
                                            <Paragraph style={styles.cardText}>{resultData.activities}</Paragraph>
                                        </Card.Content>
                                    </Card>
                                ) : null}

                                {resultData?.recommendations ? (
                                    <Card style={styles.card}>
                                        <Card.Content>
                                            <Title style={styles.cardTitle}>Recommendations</Title>
                                            <Paragraph style={styles.cardText}>{resultData.recommendations}</Paragraph>
                                        </Card.Content>
                                    </Card>
                                ) : null}

                                {resultData?.raw ? (
                                    <View>
                                        <Text style={styles.resultHeading}>Raw Result:</Text>
                                        <Text style={styles.resultText}>{resultData.raw}</Text>
                                    </View>
                                ) : null}

                                <TouchableOpacity
                                    style={[styles.button, { marginTop: 30 }]}
                                    onPress={() => router.navigate("/")}
                                >
                                    <Text style={styles.buttonText}>Take Another Photo</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
    appBar: {
        backgroundColor: "#1e1e1e",
        elevation: 0,
    },
    title: {
        color: "#fff",
        fontWeight: "bold",
    },
    content: {
        flexGrow: 1,
        padding: 20,
    },
    image: {
        width: "100%",
        height: 300,
        borderRadius: 12,
        marginBottom: 20,
    },
    resultContainer: {
        flex: 1,
        backgroundColor: "#1e1e1e",
        borderRadius: 12,
        padding: 20,
        minHeight: 200,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        color: "#fff",
        marginTop: 15,
        fontSize: 16,
    },
    errorText: {
        color: "#ff6b6b",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    resultHeading: {
        color: "#aaaaaa",
        fontSize: 14,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 10,
    },
    resultText: {
        color: "#ffffff",
        fontSize: 16,
        lineHeight: 24,
    },
    button: {
        backgroundColor: "#ffffff",
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "bold",
    },
    card: {
        marginBottom: 16,
        backgroundColor: "#2c2c2e",
    },
    cardTitle: {
        color: "#64d2ff",
        fontSize: 18,
        fontWeight: "bold",
    },
    cardText: {
        color: "#ffffff",
        fontSize: 16,
        lineHeight: 24,
        marginTop: 8,
    },
    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
        gap: 8,
    },
    tag: {
        backgroundColor: "#007AFF",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    tagText: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "600",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        marginTop: 40,
        backgroundColor: "rgba(255, 59, 48, 0.1)", // Light red transparent tint
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255, 59, 48, 0.3)",
    },
    errorTitle: {
        color: "#FF3B30", // iOS Red
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
        textAlign: "center",
    },
    errorDetail: {
        color: "#E5E5EA",
        fontSize: 15,
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 22,
    },
    retryButton: {
        borderRadius: 12,
        paddingHorizontal: 12,
        width: "100%",
    },
});
