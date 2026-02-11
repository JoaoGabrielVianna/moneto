package category_http

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/joaogabriel/moneto/pkg/utils/response"
	"github.com/joaogabriel/moneto/service/category/internal/domain/model"
)

// @Summary      Atualizar categoria
// @Description  Atualiza os dados de uma categoria existente
// @Tags         Category
// @Accept       json
// @Produce      json
// @Param        id        path      string              true  "ID da categoria"
// @Param        category  body      model.CategoryUpdate true  "Dados da categoria para atualização"
// @Success      200       {object}  model.Category
// @Failure      400       {object}  map[string]string "corpo da requisição inválido ou id ausente"
// @Failure      500       {object}  map[string]string "erro ao atualizar categoria"
// @Router       /category/update/{id} [put]
func (h *CategoryHandler) UpdateCategory(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/update/")
	log.Debug("ID: %s", id)
	if id == "" {
		log.Error("Id da categoria é obrigatória")
		response.Error(w, http.StatusBadRequest, "id da categoria é obrigatória")
		return
	}

	var update model.CategoryUpdate
	if err := json.NewDecoder(r.Body).Decode(&update); err != nil {
		log.Error("Erro ao decodificar JSON: %s", err)
		response.Error(w, http.StatusBadRequest, "corpo da requisição inválido")
		return
	}

	income, err := h.usecase.Update(r.Context(), id, update)

	if err != nil {
		log.Error("erro ao atualizar categoria: %s", err)
		response.Error(w, http.StatusInternalServerError, "erro ao atualizar categoria")
		return
	}

	log.Success("Categoria atualizada com sucesso!")
	response.Success(w, income, "Categoria atualizada com sucesso!")
}
