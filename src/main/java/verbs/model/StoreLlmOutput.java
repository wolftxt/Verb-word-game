package verbs.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoreLlmOutput {

    @Id
    @Column(length = 255)
    private String inputWords;
    @Column(length = 1023)
    private String llmOutput;
    @Column(length = 255)
    private String outputWord;
    @Column(length = 255)
    private String outputEmojis;
    private Long promptCount;
    private Boolean survived;
}
