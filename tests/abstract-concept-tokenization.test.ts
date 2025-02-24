import { describe, it, beforeEach, expect } from "vitest"

describe("Abstract Concept Tokenization Contract", () => {
  let mockStorage: Map<string, any>
  let nextConceptId: number
  let mockBlockHeight: number
  
  beforeEach(() => {
    mockStorage = new Map()
    nextConceptId = 0
    mockBlockHeight = 0
  })
  
  const mockContractCall = (method: string, args: any[] = [], sender = "default-sender") => {
    switch (method) {
      case "mint-concept":
        const [name, description] = args
        nextConceptId++
        mockStorage.set(`concept-${nextConceptId}`, {
          name,
          description,
          creator: sender,
          creation_time: mockBlockHeight,
        })
        mockStorage.set(`owner-${nextConceptId}`, sender)
        return { success: true, value: nextConceptId }
      case "transfer-concept":
        const [conceptId, recipient] = args
        const currentOwner = mockStorage.get(`owner-${conceptId}`)
        if (currentOwner !== sender) return { success: false, error: 403 }
        mockStorage.set(`owner-${conceptId}`, recipient)
        return { success: true }
      case "get-concept-info":
        return { success: true, value: mockStorage.get(`concept-${args[0]}`) }
      case "get-concept-owner":
        return { success: true, value: mockStorage.get(`owner-${args[0]}`) }
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should mint a new concept", () => {
    const result = mockContractCall(
        "mint-concept",
        ["Existentialism", "Philosophy of existence and meaning"],
        "philosopher1",
    )
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
  })
  
  it("should transfer a concept", () => {
    mockContractCall("mint-concept", ["Existentialism", "Philosophy of existence and meaning"], "philosopher1")
    const result = mockContractCall("transfer-concept", [1, "philosopher2"], "philosopher1")
    expect(result.success).toBe(true)
  })
  
  it("should not transfer a concept if not the owner", () => {
    mockContractCall("mint-concept", ["Existentialism", "Philosophy of existence and meaning"], "philosopher1")
    const result = mockContractCall("transfer-concept", [1, "philosopher3"], "philosopher2")
    expect(result.success).toBe(false)
    expect(result.error).toBe(403)
  })
  
  it("should get concept info", () => {
    mockContractCall("mint-concept", ["Existentialism", "Philosophy of existence and meaning"], "philosopher1")
    const result = mockContractCall("get-concept-info", [1])
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      name: "Existentialism",
      description: "Philosophy of existence and meaning",
      creator: "philosopher1",
      creation_time: 0,
    })
  })
  
  it("should get concept owner", () => {
    mockContractCall("mint-concept", ["Existentialism", "Philosophy of existence and meaning"], "philosopher1")
    const result = mockContractCall("get-concept-owner", [1])
    expect(result.success).toBe(true)
    expect(result.value).toBe("philosopher1")
  })
})

