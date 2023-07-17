export type PromptRecord = {
    id: string,
    prompt: string,
    model: string,
    response: string,
    status: "PROCESSING" | "SUCCESSFUL" | "ERROR",
    createdAt: string,
    updatedAt: string
}