// import { parse, ParsedQs } from 'qs'
// import { useMemo } from 'react'
// import { useRouter } from 'next/router'

// export function parsedQueryString(search?: string): ParsedQs {
//   if (!search) {
//     // react-router-dom places search string in the hash
//     // const hash = window.location.hash
//     // search = hash.substr(hash.indexOf('?'))
//   }
// //   return search && search.length > 1 ? parse(search, { parseArrays: false, ignoreQueryPrefix: true }) : {}
// }

// export default function useParsedQueryString(): ParsedQs {
//   const { query } = useRouter()
//   console.log(query)
// //   return useMemo(() => parsedQueryString(query), [query])
// }

export {};
