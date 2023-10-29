import { ContractIds } from '@/deployments/deployments'
import { contractTxWithToast } from '@/utils/contractTxWithToast'
import { Button, Card, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react'
import {
  contractQuery,
  decodeOutput,
  useInkathon,
  useRegisteredContract,
} from '@scio-labs/use-inkathon'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'

type UpdateGreetingValues = { newMessage: string }

export const GreeterContractInteractions: FC = () => {
  const { api, activeAccount, activeSigner } = useInkathon()
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.Greeter)
  const [greeterMessage, setGreeterMessage] = useState<string>()
  const [currentBidder, setCurrentBidder] = useState<string>()
  const [fetchIsLoading, setFetchIsLoading] = useState<boolean>()
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>()
  const { register, reset, handleSubmit } = useForm<UpdateGreetingValues>()

  // Fetch Greeting
  const fetchProduct = async () => {
    if (!contract || !api) return

    setFetchIsLoading(true)
    try {
      const result = await contractQuery(api, '', contract, 'productName')
      const { output, isError, decodedOutput } = decodeOutput(result, contract, 'productName')
      if (isError) throw new Error(decodedOutput)
      setGreeterMessage(output)
    } catch (e) {
      console.error(e)
      toast.error('Error while fetching greeting. Try again…')
      setGreeterMessage(undefined)
    } finally {
      setFetchIsLoading(false)
    }
  }
  useEffect(() => {
    fetchProduct()
  }, [contract])


   // Fetch Greeting
   const fetchCurrentBidder = async () => {
    if (!contract || !api) return

    setFetchIsLoading(true)
    try {
      const result = await contractQuery(api, '', contract, 'getCurrentBidder')
      const { output, isError, decodedOutput } = decodeOutput(result, contract, 'getCurrentBidder')
      if (isError) throw new Error(decodedOutput)
      setCurrentBidder(output)
    } catch (e) {
      console.error(e)
      toast.error('Error while fetching greeting. Try again…')
      setGreeterMessage(undefined)
    } finally {
      setFetchIsLoading(false)
    }
  }
  useEffect(() => {
    fetchProduct()
  }, [contract])

  // Update Greeting
  const updateGreeting = async ({ newMessage }: UpdateGreetingValues) => {
    if (!activeAccount || !contract || !activeSigner || !api) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    // Send transaction
    setUpdateIsLoading(true)
    try {
      await contractTxWithToast(api, activeAccount.address, contract, 'setMessage', {}, [
        newMessage,
      ])
      reset()
    } catch (e) {
      console.error(e)
    } finally {
      setUpdateIsLoading(false)
      fetchProduct()
    }
  }
  console.log(currentBidder)
  const reverseGreeting = async () => {
    if (!activeAccount || !contract || !activeSigner || !api) {
      toast.error("Wallet is not connected. Try again...")
      return
    }
    setUpdateIsLoading(true)
    try {
      await contractTxWithToast(api, activeAccount.address, contract, "reverseMessage", {}, [])
    } catch (e) {
      console.error(e)
    } finally {
      setUpdateIsLoading(false)
      await fetchProduct()
    }
  }

  if (!api) return null

  return (
    <>
      <div tw="flex grow flex-col space-y-4 max-w-[20rem]">
        {/* <h2 tw="text-center font-mono text-gray-400">Greeter Smart Contract</h2> */}

        {/* Fetched Greeting */}
        <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <FormControl>
            <FormLabel>Product Name</FormLabel>
            <Input
              placeholder={fetchIsLoading || !contract ? 'Loading…' : greeterMessage}
              
              readOnly
            />
          </FormControl>
        </Card>

        {/* Fetched Current Bidder */}
        <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <FormControl>
            <FormLabel>Current Bidder</FormLabel>
            <Input
              placeholder={fetchIsLoading || !contract ? 'Loading…' : currentBidder}
              
              readOnly
            />
          </FormControl>
        </Card>


        {/* Update Greeting */}
        <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <form onSubmit={handleSubmit(updateGreeting)}>
            <Stack direction="row" spacing={2} align="end">
              <FormControl>
                <FormLabel>Change Product Name</FormLabel>
                <Input disabled={updateIsLoading} {...register('newMessage')} />
              </FormControl>
              <Button
                type="submit"
                mt={4}
                colorScheme="purple"
                isLoading={updateIsLoading}
                disabled={updateIsLoading}
              >
                Submit
              </Button>
            </Stack>
          </form>
        </Card>

        <Card variant="outline" p={4} bgColor="whatsapp.100">
          <Button
            colorScheme='purple'
            isLoading={updateIsLoading}
            disabled={updateIsLoading}
            type='button'
            onClick={reverseGreeting}
          >
            Make a Bid!
          </Button>
        </Card>

        {/* Contract Address */}
        {/* <p tw="text-center font-mono text-xs text-gray-600">
          {contract ? contractAddress : 'Loading…'}
        </p> */}
      </div>
    </>
  )
}