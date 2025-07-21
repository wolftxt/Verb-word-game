package verbs.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import verbs.service.VerbsService;

@RestController
@RequestMapping("/api/verbs")
public class VerbsController {

    private final VerbsService service;

    @Autowired
    public VerbsController(VerbsService service) {
        this.service = service;
    }

    @GetMapping("/newGame")
    public ResponseEntity<GameStateResponse> getNewGame() {
        GameStateResponse game = service.newGame();
        return ResponseEntity.ok(game);
    }

    @PostMapping("/play")
    public ResponseEntity<GameStateResponse> guessVerb(@RequestBody PlayerVerb guess) {
        try {
            GameStateResponse response = service.guessVerb(guess);
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
