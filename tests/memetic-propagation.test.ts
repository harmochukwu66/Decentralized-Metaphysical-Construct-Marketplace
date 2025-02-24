import { describe, it, beforeEach, expect } from "vitest"

describe("Memetic Propagation Contract", () => {
  let mockStorage: Map<string, any>
  let nextMemeId: number
  let mockBlockHeight: number
  
  beforeEach(() => {
    mockStorage = new Map()
    nextMemeId = 0
    mockBlockHeight = 0
  })
  
  const mockContractCall = (method: string, args: any[] = []) => {
    switch (method) {
      case "create-meme":
        const [conceptId, spreadFactor, mutationRate] = args
        nextMemeId++
        mockStorage.set(`meme-${nextMemeId}`, {
          concept_id: conceptId,
          spread_factor: spreadFactor,
          mutation_rate: mutationRate,
          last_propagation: mockBlockHeight,
        })
        return { success: true, value: nextMemeId }
      case "propagate-meme":
        const [propagateMemeId] = args
        const meme = mockStorage.get(`meme-${propagateMemeId}`)
        if (!meme) return { success: false, error: 404 }
        meme.spread_factor++
        meme.last_propagation = mockBlockHeight
        return { success: true }
      case "mutate-meme":
        const [mutateMemeId, newMutationRate] = args
        const mutateMeme = mockStorage.get(`meme-${mutateMemeId}`)
        if (!mutateMeme) return { success: false, error: 404 }
        mutateMeme.mutation_rate = newMutationRate
        mutateMeme.last_propagation = mockBlockHeight
        return { success: true }
      case "get-meme-info":
        return { success: true, value: mockStorage.get(`meme-${args[0]}`) }
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should create a meme", () => {
    const result = mockContractCall("create-meme", [1, 10, 5])
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
  })
  
  it("should propagate a meme", () => {
    mockContractCall("create-meme", [1, 10, 5])
    const result = mockContractCall("propagate-meme", [1])
    expect(result.success).toBe(true)
  })
  
  it("should mutate a meme", () => {
    mockContractCall("create-meme", [1, 10, 5])
    const result = mockContractCall("mutate-meme", [1, 7])
    expect(result.success).toBe(true)
  })
})

