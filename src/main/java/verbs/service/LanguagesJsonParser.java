package verbs.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
public class LanguagesJsonParser {

    private final Map<String, Object> json;

    @Value("classpath:mydata.json")
    private Resource jsonDataResource;

    public LanguagesJsonParser(ObjectMapper objectMapper) throws IOException {
        json = objectMapper.readValue(jsonDataResource.getInputStream(), Map.class);
    }

    public Map<String, Object> getJson() {
        return json;
    }
}
