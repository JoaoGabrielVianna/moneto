package category_http

import (
	"encoding/json"
	"net/http"

	"github.com/joaogabriel/moneto/pkg/utils/response"

	"github.com/joaogabriel/moneto/service/category/internal/domain/model"
)

// @Summary      Criar categoria
// @Description  Cria uma nova categoria para um usuário
// @Tags         Category
// @Accept       json
// @Produce      json
// @Param        category  body      model.Category  true  "Dados da categoria"
// @Success      200       {object}  model.Category
// @Failure      400       {object}  map[string]string "corpo da requisição inválido"
// @Failure      500       {object}  map[string]string "erro interno do servidor"
// @Router       /category/create [post]
func (h *CategoryHandler) CreateCategory(w http.ResponseWriter, r *http.Request) {
	var category model.Category

	if err := json.NewDecoder(r.Body).Decode(&category); err != nil {
		log.Error("erro ao decodificar JSON: %s", err)
		response.Error(w, http.StatusBadRequest, "invalid request body")
		return
	}

	newCategory, err := h.usecase.CreateCategory(r.Context(), &category)
	if err != nil {
		log.Error("erro ao criar categoria: %s", err)
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	log.Success("categoria criada com sucesso!")
	response.Success(w, newCategory, "categoria criada com sucesso!")
}
