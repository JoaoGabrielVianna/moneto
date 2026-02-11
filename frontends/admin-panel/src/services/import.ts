import { importApi } from "./api"


export const importService = {
  previewCSV: async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("http://localhost:3006/import/preview", {
      method: "POST",
      body: formData,
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

saveBatch: async (rows: string[][], user: any, categoryId: string) => {
  const res = await importApi.post("/import/save-batch", {
    user_id: user.id,
    category_id: categoryId,
    rows,
  })
  return res
}

}
