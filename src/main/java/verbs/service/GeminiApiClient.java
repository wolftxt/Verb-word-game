package verbs.service;

import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.HttpOptions;
import com.google.genai.types.Part;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Provides an easy way to call the gemini api. Injects the api key from
 * application.properties. Uses v1beta api version.
 *
 * @author davidwolf
 */
@Service
public class GeminiApiClient {

    @Value("${gemini.api.key}")
    private String apiKey;
    private Client geminiClient;

    @PostConstruct
    public void init() {
        geminiClient = Client.builder().apiKey(apiKey)
                .httpOptions(HttpOptions.builder().apiVersion("v1beta").build())
                .build();
    }

    public String promptGemini(String prompt, String model) {
        Content content = Content.fromParts(Part.fromText(prompt));
        GenerateContentResponse response = geminiClient.models.generateContent(model, content, null);
        return response.text();
    }

}
