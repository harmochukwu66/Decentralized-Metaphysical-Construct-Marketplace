;; Memetic Propagation Contract

(define-map meme-propagations
  { meme-id: uint }
  {
    concept-id: uint,
    spread-factor: uint,
    mutation-rate: uint,
    last-propagation: uint
  }
)

(define-data-var next-meme-id uint u0)

(define-public (create-meme (concept-id uint) (spread-factor uint) (mutation-rate uint))
  (let
    ((meme-id (+ (var-get next-meme-id) u1)))
    (var-set next-meme-id meme-id)
    (ok (map-set meme-propagations
      { meme-id: meme-id }
      {
        concept-id: concept-id,
        spread-factor: spread-factor,
        mutation-rate: mutation-rate,
        last-propagation: block-height
      }
    ))
  )
)

(define-public (propagate-meme (meme-id uint))
  (let
    ((meme (unwrap! (map-get? meme-propagations { meme-id: meme-id }) (err u404))))
    (ok (map-set meme-propagations
      { meme-id: meme-id }
      (merge meme {
        spread-factor: (+ (get spread-factor meme) u1),
        last-propagation: block-height
      })
    ))
  )
)

(define-public (mutate-meme (meme-id uint) (new-mutation-rate uint))
  (let
    ((meme (unwrap! (map-get? meme-propagations { meme-id: meme-id }) (err u404))))
    (ok (map-set meme-propagations
      { meme-id: meme-id }
      (merge meme {
        mutation-rate: new-mutation-rate,
        last-propagation: block-height
      })
    ))
  )
)

(define-read-only (get-meme-info (meme-id uint))
  (map-get? meme-propagations { meme-id: meme-id })
)

