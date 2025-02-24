;; Abstract Concept Tokenization Contract

(define-non-fungible-token abstract-concept uint)

(define-data-var next-concept-id uint u0)

(define-map concepts
  { concept-id: uint }
  {
    name: (string-ascii 64),
    description: (string-utf8 256),
    creator: principal,
    creation-time: uint
  }
)

(define-public (mint-concept (name (string-ascii 64)) (description (string-utf8 256)))
  (let
    ((concept-id (+ (var-get next-concept-id) u1)))
    (var-set next-concept-id concept-id)
    (try! (nft-mint? abstract-concept concept-id tx-sender))
    (ok (map-set concepts
      { concept-id: concept-id }
      {
        name: name,
        description: description,
        creator: tx-sender,
        creation-time: block-height
      }
    ))
  )
)

(define-public (transfer-concept (concept-id uint) (recipient principal))
  (begin
    (try! (nft-transfer? abstract-concept concept-id tx-sender recipient))
    (ok true)
  )
)

(define-read-only (get-concept-info (concept-id uint))
  (map-get? concepts { concept-id: concept-id })
)

(define-read-only (get-concept-owner (concept-id uint))
  (nft-get-owner? abstract-concept concept-id)
)

