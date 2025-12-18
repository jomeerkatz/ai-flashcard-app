package jomeerkatz.project.ai_flashcards.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardCreateUpdateRequest {

    private String question;

    private String answer;

}
