package verbs.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Used to cache LLM responses and count how many times this exact word verb
 * combination has been used.
 *
 * @author davidwolf
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoreLlmOutput {

    public static final int inputLimit = 512;
    public static final int outputWordLimit = 64;
    public static final int outputLimit = 1024;

    @Id
    @Column(length = inputLimit)
    private String inputWords;

    @Column(length = outputLimit)
    private String llmOutput;

    @Column(length = outputWordLimit)
    private String outputWord;

    @Column(length = outputWordLimit)
    private String outputEmojis;

    private Long promptCount;
    private Boolean survived;
}
