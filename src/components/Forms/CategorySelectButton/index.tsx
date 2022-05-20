import React from "react";

import { Container, Category, Icon } from "./styles";

interface Props {
  category: string;
  onPress: () => void;
}

export function CategorySelectButton({ category, onPress }: Props) {
  return (
    <Container onPress={onPress}>
      <Category>{category}</Category>
      <Icon name="chevron-down" />
    </Container>
  );
}
