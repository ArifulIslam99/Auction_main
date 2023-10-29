import Link from 'next/link'
import { FC } from 'react'
import { HiOutlineExternalLink } from 'react-icons/hi'
import 'twin.macro'
import { Text } from '@chakra-ui/react'
export const HomeTopBar: FC = () => {
  return (
    <>
      <div tw="absolute top-0 left-0 right-0 z-10 flex items-center justify-center whitespace-pre-wrap bg-gray-900 py-8 px-4 text-center font-semibold text-sm text-white/75 hover:text-white">
        <Text fontSize='4xl' fontFamily='monospace'>BID AND BUY!</Text>
      </div>
    </>
  )
}
