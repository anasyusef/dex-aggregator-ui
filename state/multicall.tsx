import { createMulticall } from '@uniswap/redux-multicall'
import { useInterfaceMulticall } from 'hooks/useContract'
import useBlockNumber from 'hooks/useBlockNumber'
import { combineReducers, createStore } from 'redux'
import { useActiveWeb3 } from 'contexts/Web3Provider'

const multicall = createMulticall()
const reducer = combineReducers({ [multicall.reducerPath]: multicall.reducer })
export const store = createStore(reducer)

export default multicall

export function MulticallUpdater() {
  const { chainId } = useActiveWeb3()
  const latestBlockNumber = useBlockNumber()
  const contract = useInterfaceMulticall()
  return <multicall.Updater chainId={chainId} latestBlockNumber={latestBlockNumber} contract={contract} />
}
