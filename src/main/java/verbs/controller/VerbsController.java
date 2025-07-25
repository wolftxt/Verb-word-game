package verbs.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import verbs.service.VerbsService;

/**
 * Defines the api endpoints
 *
 * @author davidwolf
 */
@RestController
@RequestMapping("/api/verbs")
public class VerbsController {

    private final VerbsService service;

    @Autowired
    public VerbsController(VerbsService service) {
        this.service = service;
    }

    @GetMapping("/supportedLanguages")
    public ResponseEntity<String[]> getSupportedLanguages() {
        return ResponseEntity.ok(service.getLanguageList());
    }

    @GetMapping("/newGame/{language}")
    public ResponseEntity<GameState> getNewGame(@PathVariable String language) {
        GameState game = service.newGame(language);
        return game == null ? ResponseEntity.badRequest().build() : ResponseEntity.ok(game);
    }

    @PostMapping("/play")
    public ResponseEntity<GameState> guessVerb(@RequestBody PlayerVerb guess) {
        try {
            GameState response = service.guessVerb(guess);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{gameId}")
    public ResponseEntity<Void> deleteGame(@PathVariable String gameId) {
        if (service.deleteGame(gameId)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
