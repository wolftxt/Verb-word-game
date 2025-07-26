package verbs.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * This is the class the client JSON input is converted to in guessVerb().
 *
 * @author davidwolf
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerVerb {

    private String gameId;
    private String guess;
}
