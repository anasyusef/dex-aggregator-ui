import type { NextApiRequest, NextApiResponse } from 'next'
import yup from 'yup'

type Data = {
  name: string
}

const swapSchema = yup.object({
  fromTokenAddress: yup.string().required(),
  toTokenAddress: yup.string().required(),
  amount: yup.string().required(),
  fromAddress: yup.string().required(),
  slippage: yup.number().required(),
  transactionDeadline: yup.number().required(),
  network: yup.number()
})

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}
