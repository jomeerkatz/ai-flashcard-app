package jomeerkatz.project.ai_flashcards.exceptions;

public class CardException extends BaseException{
    public CardException() {
        super();
    }

    public CardException(String message) {
        super(message);
    }

    public CardException(String message, Throwable cause) {
        super(message, cause);
    }

    public CardException(Throwable cause) {
        super(cause);
    }
}
