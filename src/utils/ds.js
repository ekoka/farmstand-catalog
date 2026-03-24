export function difference(a, b) {
    const s1 = new Set(a)
    const s2 = new Set(b)
    return s1.difference(s2).union(s2.difference(s1))
}

export function union(a, b) {
    const s1 = new Set(a)
    const s2 = new Set(b)
    return s1.union(s2)
}
