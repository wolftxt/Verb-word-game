package verbs.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameStateResponse {

    private String gameId;
    private long score;
    private String llmOutput;
    private String word;
    private boolean playing;
}
