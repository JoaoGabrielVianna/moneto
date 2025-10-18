package usecase

import "context"

func (uc *ExpenseUsecase) Delete(ctx context.Context, id string) error {
	return uc.Repo.Delete(ctx, id)
}
