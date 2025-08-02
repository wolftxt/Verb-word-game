package verbs.service;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import verbs.controller.GameNotFoundException;
import verbs.controller.GameState;
import verbs.controller.PlayerVerb;
import verbs.model.StoreLlmOutput;
import verbs.repository.LlmOutputRepository;

/**
 * Class used to manage state and handle most of the backend logic.
 *
 * @author davidwolf
 */
@Service
public class VerbsService {

    private static final String initialEmojis = "🐰";

    private final String initialPrompt;

    private final LlmOutputRepository repository;
    private final GeminiApiClient geminiClient;
    private final LanguagesJsonParser parser;

    private final Map<String, GameState> games = new HashMap();

    @Autowired
    public VerbsService(LlmOutputRepository repository, GeminiApiClient geminiClient, LanguagesJsonParser parser) {
        this.repository = repository;
        this.geminiClient = geminiClient;
        this.parser = parser;
        Scanner sc = new Scanner(VerbsService.class.getResourceAsStream("/prompt.txt"));
        sc.useDelimiter("\\A");
        initialPrompt = sc.next();
    }

    public String[] getLanguageList() {
        return (String[]) parser.getJson().keySet().toArray(String[]::new);
    }

    public GameState newGame(String language) {
        String gameId = UUID.randomUUID().toString();
        String initialWord = (String) parser.getJson().get(language);
        if (initialWord == null) {
            throw new IllegalArgumentException("Language: " + language + " is not supported");
        }
        List<String> usedWords = new ArrayList();
        usedWords.add(initialWord);
        List<String> usedVerbs = new ArrayList();

        GameState newGame = new GameState(gameId, language, "", 0, initialWord, initialEmojis, usedWords, usedVerbs, 0, true);

        games.put(gameId, newGame);
        return newGame;
    }

    /**
     * Normalizes the verb. Uses the word verb combination from the database if
     * it exists. If the word verb combination doesn't exist then it calls
     * promptLlm() for a new one. Then it increments the prompt count for this
     * word verb combination.
     *
     * @throws GameNotFoundException if PlayerVerb has an ID the server doesn't
     * recognize
     * @throws IllegalArgumentException if the verb has already been guessed or
     * game is not in playing state
     * @param guess
     * @return
     */
    public GameState guessVerb(PlayerVerb guess) {
        String verb = guess.getGuess().replace(' ', '_').trim().toLowerCase();
        if (verb.length() > StoreLlmOutput.inputLimit) {
            throw new IllegalArgumentException("Input is longer than the maximum length of " + StoreLlmOutput.inputLimit);
        }
        GameState game = games.get(guess.getGameId());
        if (game == null) {
            throw new GameNotFoundException("Game with id: " + guess.getGameId() + " was not found");
        }
        if (game.getUsedVerbs().contains(verb)) {
            throw new IllegalArgumentException("Verb: " + verb + " has already been guessed");
        }
        if (!game.isPlaying()) {
            throw new IllegalArgumentException("Game with id: " + guess.getGameId() + " is not in playing state");
        }
        game.setPlaying(false);
        game.getUsedVerbs().add(verb);
        String databaseKey = game.getWord() + "_" + verb;
        Optional<StoreLlmOutput> dbOutput = repository.findById(databaseKey);
        if (dbOutput.isPresent()) {
            StoreLlmOutput output = dbOutput.get();
            output.setPromptCount(output.getPromptCount() + 1);
            repository.save(output);
            applyLlmOutputToGame(dbOutput.get(), game);
            return game;
        }
        StoreLlmOutput output = promptLlm(game, guess.getGuess());
        applyLlmOutputToGame(output, game);
        repository.save(output);
        return game;
    }

    public boolean deleteGame(String gameId) {
        if (games.containsKey(gameId)) {
            games.remove(gameId);
            return true;
        }
        return false;
    }

    private void applyLlmOutputToGame(StoreLlmOutput llmOutput, GameState game) {
        game.setLlmOutput(llmOutput.getLlmOutput());
        game.setPromptCount(llmOutput.getPromptCount());
        game.setWord(llmOutput.getOutputWord());
        game.setEmojis(llmOutput.getOutputEmojis());
        game.getUsedWords().add(llmOutput.getOutputWord());
        game.setPlaying(llmOutput.getSurvived());
        if (!game.isPlaying()) {
            games.remove(game.getGameId());
        } else {
            game.setScore(game.getScore() + 1);
        }
    }

    /**
     * Prompts gemini with prompt.txt to which it appends Input, Original word,
     * User's verb, and Output language. Then it parses the output and creates a
     * StoreLlmOutput object.
     *
     * @param game
     * @param verb
     * @return
     */
    private StoreLlmOutput promptLlm(GameState game, String verb) {
        StringBuilder prompt = new StringBuilder(initialPrompt);
        List<String> usedWords = game.getUsedWords();
        for (int i = 0; i < usedWords.size() - 1; i++) {
            prompt.append(usedWords.get(i));
            prompt.append(", ");
        }
        prompt.append(usedWords.getLast()).append('\n')
                .append("Input:").append('\n')
                .append("Original word: ").append(game.getWord()).append('\n')
                .append("User's verb: ").append(verb).append('\n')
                .append("Output language: ").append(game.getLanguage());
        String output = geminiClient.promptGemini(prompt.toString(), "gemini-2.5-flash");
        System.out.println(output);
        String input = game.getWord() + '_' + verb;

        String[] lines = output.split("\\n+");
        Boolean survived = Boolean.valueOf(lines[0]);
        String response = lines[1];
        if (response.length() > StoreLlmOutput.outputLimit) {
            response = response.substring(0, StoreLlmOutput.outputLimit);
        }
        if (!survived) {
            return new StoreLlmOutput(input, response, null, null, 1L, survived);
        }
        String word = lines[2];
        if (game.getUsedWords().contains(word)) {
            throw new RuntimeException("LLM halucinated");
        }
        String emojis = lines[3];
        if (word.length() > StoreLlmOutput.outputWordLimit) {
            word = word.substring(0, StoreLlmOutput.outputWordLimit);
        }
        if (emojis.length() > StoreLlmOutput.outputWordLimit) {
            emojis = word.substring(0, StoreLlmOutput.outputWordLimit);
        }
        return new StoreLlmOutput(input, response, word, emojis, 1L, survived);
    }

}
