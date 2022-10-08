import { Flex, Button } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

export default function PaginationBar({ currentPage, pageKeys, onClickPage, isLoading }) {
  return (
    <Flex as="nav" alignItems="center" justifyContent="center" px="4" py="3" mt="10">
      <Button
        onClick={(e) => onClickPage(e, currentPage - 1)}
        isDisabled={currentPage === 0 || isLoading}
        p="2"
        bg="none"
        _hover={currentPage === 0 ? { bg: "none" } : { bg: "blue.50", textColor: "brand" }}
      >
        <ChevronLeftIcon />
      </Button>

      {pageKeys.map((_, i) => {
        if (currentPage === i) {
          return (
            <Button
              key={i}
              isActive={true}
              isDisabled={isLoading}
              onClick={(e) => onClickPage(e, i)}
              aria-current="page"
              textColor="brand"
              _active={{ bg: "blue.50" }}
            >
              {i + 1}
            </Button>
          );
        } else {
          return (
            <Button
              key={i}
              isDisabled={isLoading}
              onClick={(e) => onClickPage(e, i)}
              bg="none"
              _hover={{ bg: "blue.50", textColor: "brand" }}
            >
              {i + 1}
            </Button>
          );
        }
      })}

      <Button
        onClick={(e) => onClickPage(e, currentPage + 1)}
        isDisabled={!pageKeys[currentPage + 1] || isLoading}
        p="2"
        bg="none"
        _hover={!pageKeys[currentPage + 1] ? { bg: "none" } : { bg: "blue.50", textColor: "brand" }}
      >
        <ChevronRightIcon />
      </Button>
    </Flex>
  );
}
