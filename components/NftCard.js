import { Box, Image, Text, Link, Flex } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";

const truncate = (str) => {
  if (str.length > 12) {
    return `${str.substring(0, 5)}...${str.substring(str.length - 5)}`;
  } else {
    return str;
  }
};

export default function NftCard({ nft }) {
  const splitGateway = nft.media[0].gateway.split(".");
  const fileType = splitGateway.slice(-1)[0];

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(nft.contract.address);
  };

  return (
    <Box
      display="flex"
      flexDir="column"
      justifyContent="space-between"
      rounded="xl"
      overflow="hidden"
      bg="white"
      border="1px"
      borderColor="gray.300"
      maxW="lg"
    >
      <Box>
        {fileType === "mp4" ? (
          <video loop autoPlay muted>
            <source src={nft.media[0].gateway} type="video/mp4" />
          </video>
        ) : (
          <Image src={nft.media[0].gateway}></Image>
        )}
      </Box>

      <Box display="flex" flexDir="column" rowGap="2" p="4" roundedBottom="md" bg="gray.100">
        <Box mb="2">
          <Text as="h2" fontSize="xl" color="gray.800" mb="3">
            {nft.title}
          </Text>
          <Text as="p" ccolor="gray.600">
            Id: {truncate(nft.id.tokenId)}
          </Text>

          <Flex alignItems="center">
            <Text as="p" color="gray.600" mr="2">
              {truncate(nft?.contract?.address)}
            </Text>
            <Box>
              <CopyIcon
                onClick={copyAddressToClipboard}
                cursor="pointer"
                boxSize="12px"
                mt="-1"
                color="gray.600"
              />
            </Box>
          </Flex>
        </Box>

        <Link
          color="blue.400"
          my="2"
          textAlign="center"
          target="_blank"
          rel="noreferrer"
          href={`https://etherscan.io/token/${nft.contract.address}`}
        >
          View on Etherscan
        </Link>
      </Box>
    </Box>
  );
}
