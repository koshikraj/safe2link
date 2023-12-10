// @ts-nocheck
import { Box, Center, Group, Stack, Text } from "@mantine/core";
import EmptyStateImg from "../../../assets/images/empty.svg";

export interface EmptyStateProps {
  message?: string;
}

export const EmptyState = (props: EmptyStateProps) => {
  const { message } = props;
  return (
    <Box mt={30}>
      <Center>
        <Stack>
          <img src={EmptyStateImg} alt="empty" />
          <Text align="center">{message}</Text>
        </Stack>
      </Center>
    </Box>
  );
};
