package jomeerkatz.project.ai_flashcards.domain.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardCreateUpdateRequestDto {

    @NotBlank(message = "❌question can't be blanked!")
    private String question;

    @NotBlank(message = "❌answer can't be blanked!")
    private String answer;
}
