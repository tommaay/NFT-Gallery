import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { theme } from "/styles/theme";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Box minH="100vh" bg="bg" px={5}>
          <Component {...pageProps} />
        </Box>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
