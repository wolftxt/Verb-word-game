package verbs.controller;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Class storing game state. Stored in a HashMap in VerbsService. This class is
 * also converted to a JSON by Spring and sent to the client.
 *
 * @author davidwolf
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameState {

    private String gameId;
    private String language;
    private String llmOutput;
    private long promptCount;
    private String word;
    private String emojis;
    private List<String> usedWords;
    private List<String> usedVerbs;
    private long score;
    private boolean playing;
}
