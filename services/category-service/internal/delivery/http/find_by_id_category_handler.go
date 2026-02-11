package category_http

import (
	"net/http"
	"strings"

	"github.com/joaogabriel/moneto/pkg/utils/response"
)

// @Summary      Buscar categoria por ID
// @Description  Retorna os detalhes de uma categoria específica
// @Tags         Category
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "ID da categoria"
// @Success      200  {object}  model.Category
// @Failure      400  {object}  map[string]string "id da categoria é obrigatório"
// @Failure      500  {object}  map[string]string "categoria não encontrada"
// @Router       /category/{id} [get]
func (h CategoryHandler) FindByIdCategory(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/")
	if id == "" {
		log.Error("id da categoria é obrigatório")
		response.Error(w, http.StatusBadRequest, "id da categoria é obrigatório")
	}

	category, err := h.usecase.FindById(r.Context(), id)
	if err != nil {
		log.Error("categoria não encontrada: %s", err)
		response.Error(w, http.StatusInternalServerError, "categoria não encontrada")
		return
	}

	log.Success("categoria encontrada com sucesso")
	response.Success(w, category, "categoria encontrada com sucesso")
}
