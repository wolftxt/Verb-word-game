package verbs.controller;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameState {

    private String gameId;
    private String llmOutput;
    private String word;
    private String emojis;
    private List<String> usedWords;
    private List<String> usedVerbs;
    private long score;
    private boolean playing;
}
