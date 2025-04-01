import { Button, Center, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { apiService } from "../../api/ApiService";
import { BoughtItemType } from "../../api/Types";

export function BoughtItems() {
  const [boughtItems, setBoughtItems] = useState<BoughtItemType[]>([]);
  const [selectedRange, setSelectedRange] = useState("today");

  const fetchBoughtItems = (range: string) => {
    setSelectedRange(range);
    apiService.grocery_item
      .get_bought_items(range)
      .then((res) => setBoughtItems(res));
  };

  useEffect(() => {
    fetchBoughtItems("today");
  }, []);

  return (
    <Center w="100%" flexDirection="column" gap={2}>
      <Center
        w="100%"
        justifyContent="center"
        flexDirection={{ base: "column", md: "row" }}
        gap={2}
      >
        <Button
          w={{ base: "100%", md: "10rem" }}
          onClick={() => fetchBoughtItems("today")}
          bg={selectedRange === "today" ? "primary.700" : "secondary.700"}
          _hover={{
            bg: selectedRange === "today" ? "primary.800" : "secondary.800",
          }}
          color={"neutral.50"}
          aria-label="Vis i dag"
        >
          I dag
        </Button>

        <Button
          w={{ base: "100%", md: "10rem" }}
          onClick={() => fetchBoughtItems("this_week")}
          bg={selectedRange === "this_week" ? "primary.700" : "secondary.700"}
          _hover={{
            bg: selectedRange === "this_week" ? "primary.800" : "secondary.800",
          }}
          color={"neutral.50"}
          aria-label="Vis denne uken"
        >
          Denne uken
        </Button>

        <Button
          w={{ base: "100%", md: "10rem" }}
          onClick={() => fetchBoughtItems("last_month")}
          bg={selectedRange === "last_month" ? "primary.700" : "secondary.700"}
          _hover={{
            bg:
              selectedRange === "last_month" ? "primary.800" : "secondary.800",
          }}
          color={"neutral.50"}
          aria-label="Vis forrige måned"
        >
          Forrige måned
        </Button>
      </Center>
      <Table.Root as="table" shadow="sm" interactive>
        <Table.Header as="thead">
          <Table.Row as="tr" bg="neutral.100">
            <Table.ColumnHeader as="th">Vare</Table.ColumnHeader>
            <Table.ColumnHeader as="th" textAlign="right">
              Totalpris (NOK)
            </Table.ColumnHeader>
            <Table.ColumnHeader as="th" textAlign="right">
              Dato kjøpt
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body as="tbody">
          {boughtItems.map((item) => (
            <Table.Row
              as="tr"
              key={item.product + item.bought_at}
              bg="neutral.100"
              _hover={{ bg: "primary.50" }}
              tabIndex={0}
              _focus={{ outline: "2px solid", outlineColor: "primary.700" }}
            >
              <Table.Cell as="td">{`${item.quantity}x ${item.product}`}</Table.Cell>
              <Table.Cell as="td" textAlign="right">
                {`${Number(item.price) * Number(item.quantity)} NOK`}
              </Table.Cell>
              <Table.Cell as="td" textAlign="right">
                {new Date(item.bought_at).toLocaleString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer as="tfoot">
          <Table.Row as="tr" bg="neutral.200">
            <Table.Cell as="td">Total</Table.Cell>
            <Table.Cell as="td" textAlign="right">
              {`${boughtItems.reduce(
                (sum, item) => sum + Number(item.price) * Number(item.quantity),
                0
              )} NOK`}
            </Table.Cell>
            <Table.Cell as="td" />
          </Table.Row>
        </Table.Footer>
      </Table.Root>
    </Center>
  );
}
