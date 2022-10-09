import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { Container, Flex, Heading, Grid, Center, Spinner, useToast } from "@chakra-ui/react";
import SearchForm, { TAB_TYPE } from "/components/SearchForm";
import NftCard from "../components/NftCard";
import PaginationBar from "../components/PaginationBar";

export default function Home() {
  const [nftsData, setNftsData] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [collectionAddressForWallet, setCollectionAddressForWallet] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");
  const [shouldFetchForCollections, setShouldFetchForCollections] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageKeys, setPageKeys] = useState([""]);
  const [nextTokens, setNextTokens] = useState([""]);
  const [appLoaded, setAppLoaded] = useState(false);

  function shouldDisableButton(tabType) {
    if (tabType === TAB_TYPE.OWNER) {
      return (
        (!shouldFetchForCollections && !walletAddress) ||
        (shouldFetchForCollections && (!walletAddress || !collectionAddressForWallet))
      );
    } else {
      return !collectionAddress;
    }
  }

  async function getchNftsForOwner(pageKey = "") {
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTs?owner=${walletAddress}&pageSize=50`;
    const nftOwnersQuery =
      shouldFetchForCollections && collectionAddressForWallet
        ? `&contractAddresses[]=${collectionAddressForWallet}`
        : "";
    const pageKeyQuery = pageKey ? `&pageKey=${pageKey}` : "";
    const url = baseURL + nftOwnersQuery + pageKeyQuery;

    const data = await fetch(url).then((res) => res.json());
    setNftsData(data?.ownedNfts || []);

    if (data.pageKey) {
      setPageKeys((prevKeys) => {
        const newKeys = [...prevKeys];
        newKeys[currentPage + 1] = data.pageKey;

        return newKeys;
      });
    }

    return data;
  }

  async function getchNftsOfCollection(startToken = "") {
    const baseUrl = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTsForCollection?contractAddress=${collectionAddress}&withMetadata=true&pageSize=50`;
    const startTokenQuery = startToken ? `&startToken=${startToken}` : "";
    const url = baseUrl + startTokenQuery;

    const data = await fetch(url).then((res) => res.json());
    setNftsData(data?.nfts || []);

    if (data?.nextToken) {
      setNextTokens((prevTokens) => {
        const newTokens = [...prevTokens];
        newTokens[currentPage + 1] = data.nextToken;

        return newTokens;
      });
    }

    return data;
  }

  const {
    refetch: fetchNftsForOwner,
    isFetching: isFetchingNfts,
    error: fetchNftsError,
  } = useQuery(
    ["Owners NFTs", walletAddress, collectionAddressForWallet, pageKeys[currentPage]],
    () => getchNftsForOwner(pageKeys[currentPage]),
    {
      enabled: false,
      keepPreviousData: true,
      retry: 1,
    }
  );

  const {
    data,
    refetch: fetchNftsOfCollection,
    isFetching: isFetchingCollection,
    error: fetchCollectionsError,
  } = useQuery(
    ["Collection NFTs", collectionAddress, nextTokens[currentPage]],
    () => getchNftsOfCollection(nextTokens[currentPage]),
    {
      enabled: false,
      keepPreviousData: true,
      retry: 1,
    }
  );

  function fetchNfts() {
    setCurrentPage(0);
    setPageKeys([""]);
    setNextTokens([""]);

    if (tabIndex === 0) {
      fetchNftsForOwner();
    } else {
      fetchNftsOfCollection();
    }
  }

  function onClickPage(e, pageIndex) {
    e.preventDefault();
    if (currentPage === pageIndex) return;

    setCurrentPage(() => pageIndex);
  }

  function onTabChange(index) {
    setTabIndex(index);
    setNftsData([]);
    setWalletAddress("");
    setCollectionAddressForWallet("");
    setCollectionAddress("");
    setShouldFetchForCollections(false);
    setCurrentPage(0);
    setPageKeys([""]);
    setNextTokens([""]);
  }

  useEffect(() => {
    if (appLoaded) {
      if (tabIndex === 0) {
        fetchNftsForOwner(pageKeys[currentPage]);
      } else {
        fetchNftsOfCollection(nextTokens[currentPage]);
      }
    } else {
      setAppLoaded(true);
    }
  }, [currentPage]);

  const toast = useToast();

  useEffect(() => {
    if (fetchNftsError) {
      toast({
        title: "Error",
        description: fetchNftsError.message,
        status: "error",
        duration: 10000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [fetchNftsError]);

  useEffect(() => {
    if (fetchCollectionsError) {
      toast({
        title: "Error",
        description: fetchCollectionsError.message,
        status: "error",
        duration: 10000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [fetchCollectionsError]);

  const isLoading = isFetchingNfts || isFetchingCollection;

  return (
    <Container py="8" px="6" bg="white" minH="100vh" maxW="container.xl">
      <Head>
        <title>Road to Web3 - NFT Gallery</title>
        <meta name="description" content="NFT gallery to search and display NFTs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex direction="column" align="center">
        <Heading as="h1" fontSize="4xl" fontWeight="bold" mb="6" color="brand">
          NFT Gallery
        </Heading>
        <SearchForm
          setWalletAddress={setWalletAddress}
          setCollectionAddressForWallet={setCollectionAddressForWallet}
          setCollectionAddress={setCollectionAddress}
          shouldFetchForCollections={shouldFetchForCollections}
          setShouldFetchForCollections={setShouldFetchForCollections}
          setTabIndex={setTabIndex}
          fetchNfts={fetchNfts}
          shouldDisableButton={shouldDisableButton}
          onTabChange={onTabChange}
          walletAddress={walletAddress}
          collectionAddressForWallet={collectionAddressForWallet}
          collectionAddress={collectionAddress}
        />
        {(pageKeys.length > 1 || nextTokens.length > 1) && (
          <PaginationBar
            currentPage={currentPage}
            pageKeys={tabIndex === 0 ? pageKeys : nextTokens}
            onClickPage={onClickPage}
            isLoading={isLoading}
          />
        )}
        {isLoading ? (
          <Center>
            <Spinner size="xl" />
          </Center>
        ) : (
          <>
            <Grid
              templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
              gap="10"
              mt="10"
            >
              {nftsData.map((data) => (
                <NftCard nft={data} key={data?.tokenUri?.gateway} />
              ))}
            </Grid>
          </>
        )}
        {(pageKeys.length > 1 || nextTokens.length > 1) && (
          <PaginationBar
            currentPage={currentPage}
            pageKeys={tabIndex === 0 ? pageKeys : nextTokens}
            onClickPage={onClickPage}
            isLoading={isLoading}
          />
        )}
      </Flex>
    </Container>
  );
}
