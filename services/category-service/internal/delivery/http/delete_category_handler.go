package category_http

import (
	"net/http"
	"strings"

	"github.com/joaogabriel/moneto/pkg/utils/response"
)

// @Summary      Deletar categoria
// @Description  Remove uma categoria existente pelo ID
// @Tags         Category
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "ID da categoria"
// @Success      200  {object}  map[string]string "categoria deletada com sucesso"
// @Failure      400  {object}  map[string]string "id da categoria é obrigatória"
// @Failure      500  {object}  map[string]string "categoria não deletada"
// @Router       /category/delete/{id} [delete]
func (h *CategoryHandler) DeleteCategory(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/delete/")
	if id == "" {
		log.Error("Id da categoria é obrigatória")
		response.Error(w, http.StatusBadRequest, "id da categoria é obrigatória")
		return
	}

	err := h.usecase.Delete(r.Context(), id)
	if err != nil {
		log.Error("Categoria não deletada: %s, id: %s", err, id)
		response.Error(w, http.StatusInternalServerError, "categoria não deletada")
		return
	}

	log.Success("Categoria deletada com sucesso!")
	response.Success(w, err, "Categoria deletada com sucesso!")
}
