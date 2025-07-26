package verbs.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

/**
 * Loads and parses the JSON from languages.json into a Map<String, Object>
 *
 * @author davidwolf
 */
@Service
public class LanguagesJsonParser {

    private final ObjectMapper objectMapper;
    private Map<String, Object> json;

    @Value("classpath:languages.json")
    private Resource jsonDataResource;

    public LanguagesJsonParser(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void loadAndParseJson() throws IOException {
        json = objectMapper.readValue(jsonDataResource.getInputStream(), Map.class);
    }

    public Map<String, Object> getJson() {
        return json;
    }
}
