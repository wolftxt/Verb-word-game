package verbs.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
class GameNotFoundException extends RuntimeException {

    public GameNotFoundException(String id) {
        super("Game with ID: " + id + " not found.");
    }
}
