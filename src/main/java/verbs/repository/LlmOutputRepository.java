package verbs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import verbs.model.StoreLlmOutput;

@Repository
public interface LlmOutputRepository extends JpaRepository<StoreLlmOutput, String> {
}
