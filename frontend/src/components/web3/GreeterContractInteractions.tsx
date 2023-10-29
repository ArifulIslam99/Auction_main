import { ContractIds } from '@/deployments/deployments'
import { contractTxWithToast } from '@/utils/contractTxWithToast'
import { Box, Button, Card, FormControl, FormLabel, Input, SimpleGrid, Stack } from '@chakra-ui/react'
import { Flex, Spacer } from '@chakra-ui/react'
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
  const [currentOwner, setCurrentOwner] = useState<string>()
  const [soldStatus, setSoldStatus] = useState<boolean>()
  const [currentBid, setCurrentBid] = useState<string>()
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


  // Fetch Current Bidder
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

  // Fetch Current Bid
  const fetchCurrentBid = async () => {
    if (!contract || !api) return

    setFetchIsLoading(true)
    try {
      const result = await contractQuery(api, '', contract, 'getCurrentBid')
      const { output, isError, decodedOutput } = decodeOutput(result, contract, 'getCurrentBid')
      if (isError) throw new Error(decodedOutput)
      setCurrentBid(output)
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

  // Fetch Current Owner
  const fetchCurrentOwner = async () => {
    if (!contract || !api) return

    setFetchIsLoading(true)
    try {
      const result = await contractQuery(api, '', contract, 'getCurrentOwner')
      const { output, isError, decodedOutput } = decodeOutput(result, contract, 'getCurrentOwner')
      if (isError) throw new Error(decodedOutput)
      setCurrentOwner(output)
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

  // Fetch Sold Status
  const fetchSoldStatus = async () => {
    if (!contract || !api) return

    setFetchIsLoading(true)
    try {
      const result = await contractQuery(api, '', contract, 'get_sold_status')
      const { output, isError, decodedOutput } = decodeOutput(result, contract, 'get_sold_status')
      if (isError) throw new Error(decodedOutput)
      setSoldStatus(output)
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
      await contractTxWithToast(api, activeAccount.address, contract, 'setProductName', {}, [
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


  //Make a bid to the contract
  const makeBid = async () => {
    if (!activeAccount || !contract || !activeSigner || !api) {
      toast.error("Wallet is not connected. Try again...")
      return
    }

    setUpdateIsLoading(true)
    try {
      await contractTxWithToast(api, activeAccount.address, contract, "bidProduct", {
        value: 200000000
      }, [])
    } catch (e) {
      console.error(e)
    } finally {
      setUpdateIsLoading(false)
      await fetchProduct()
      // location.reload();
    }
  }

  //Sell the product
  const finalizeProduct = async () => {
    if (!activeAccount || !contract || !activeSigner || !api) {
      toast.error("Wallet is not connected. Try again...")
      return
    }

    setUpdateIsLoading(true)
    try {
      await contractTxWithToast(api, activeAccount.address, contract, "finalize_product", {}, [])
    } catch (e) {
      console.error(e)
    } finally {
      setUpdateIsLoading(false)
      await fetchProduct()
      // location.reload();
    }
  }

  //Sell the product
  const returnMoney = async () => {
    if (!activeAccount || !contract || !activeSigner || !api) {
      toast.error("Wallet is not connected. Try again...")
      return
    }

    setUpdateIsLoading(true)
    try {
      await contractTxWithToast(api, activeAccount.address, contract, "take_back_money", {}, [])
    } catch (e) {
      console.error(e)
    } finally {
      setUpdateIsLoading(false)
      await fetchProduct()
      // location.reload();
    }
  }


  if (!api) return null

  return (
    <>

    
      <SimpleGrid columns={2} spacing={10}>
        <Box height='80px'>
          <Card variant="outline" p={4} bgColor="whiteAlpha.100">
            <FormControl>
              <FormLabel>Product Name</FormLabel>
              <Input
                placeholder={fetchIsLoading || !contract ? 'Loading…' : greeterMessage}

                readOnly
              />
            </FormControl>
          </Card>
        </Box>
        <Box height='80px'>
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
        </Box>
        <Box height='80px'>
          {/* Fetched Current Bid */}
          <Card variant="outline" p={4} bgColor="whiteAlpha.100">
            <FormControl>
              <FormLabel>Current Bid</FormLabel>
              <Input
                placeholder={fetchIsLoading || !contract ? 'Loading…' : currentBid}

                readOnly
              />
            </FormControl>
          </Card>
        </Box>
        <Box height='80px'>
          {/* Fetched Current Bid */}
          <Card variant="outline" p={4} bgColor="whiteAlpha.100">
            <FormControl>
              <FormLabel>Current Owner</FormLabel>
              <Input
                placeholder={fetchIsLoading || !contract ? 'Loading…' : currentOwner}

                readOnly
              />
            </FormControl>
          </Card>

        </Box>
        <Box height='80px'>
          {/* Update Product Name */}
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
        </Box>
        <Box height='80px'>
          {/* Fetched Current Bid */}
          <Card variant="outline" p={4} bgColor="whiteAlpha.100">
            <FormControl>
              <FormLabel>Auction Status</FormLabel>
              <Input
                placeholder={!soldStatus? 'Running' : 'Auction End'}
                readOnly
              />
            </FormControl>
          </Card>

        </Box>
      </SimpleGrid>

      <div tw="flex grow flex-col space-y-4 max-w-[20rem]">
        {/* <h2 tw="text-center font-mono text-gray-400">Greeter Smart Contract</h2> */}




        <Card variant="outline" p={4} bgColor="whatsapp.100">
          <Button
            colorScheme='purple'
            isLoading={updateIsLoading}
            disabled={updateIsLoading}
            type='button'
            // onClick={reverseGreeting}
            onClick={() => { fetchCurrentBid(); fetchCurrentBidder(); fetchCurrentOwner(); fetchSoldStatus() }}
          >
            Update Bid Stauts
          </Button>
        </Card>

        <Card variant="outline" p={4} bgColor="whatsapp.100">
          <Button
            colorScheme='purple'
            isLoading={updateIsLoading}
            disabled={updateIsLoading}
            type='button'
            onClick={makeBid}

          >
            Make a Bid!
          </Button>
        </Card>

        <Card variant="outline" p={4} bgColor="whatsapp.100">
          <Button
            colorScheme='purple'
            isLoading={updateIsLoading}
            disabled={updateIsLoading}
            type='button'
            onClick={finalizeProduct}

          >
            Sell The Product!
          </Button>
        </Card>

        <Card variant="outline" p={4} bgColor="whatsapp.100">
          <Button
            colorScheme='purple'
            isLoading={updateIsLoading}
            disabled={updateIsLoading}
            type='button'
            onClick={returnMoney}

          >
            Get Back Money
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