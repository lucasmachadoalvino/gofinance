import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from "react-native";
import { Button } from "../../components/Forms/Button";
import { CategorySelectButton } from "../../components/Forms/CategorySelectButton";
import { InputForm } from "../../components/Forms/inputForm";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";
import { Types } from "../../global/interfaces/interfaces";
import { CategorySelect } from "../CategorySelect";
import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
} from "./styles";

import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../hooks/auth";

interface FormData {
  [name: string]: any;
}

const scheme = Yup.object().shape({
  name: Yup.string().required("nome é obrigatorio"),
  amount: Yup.number()
    .required("o valor é obrigatorio")
    .typeError("informe um valor numerico")
    .positive("o valor nao pode ser negativo"),
});

export function Register() {
  const [transactionType, setTransactionType] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria",
  });

  const { user } = useAuth();

  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(scheme),
  });

  function handleTransactionTypeSelect(type: Types) {
    setTransactionType(type);
  }

  function handleOpenCategoryModal() {
    setCategoryModalOpen(true);
  }

  function handleCloseCategoryModal() {
    setCategoryModalOpen(false);
  }

  function handleSelectCategory(
    item: React.SetStateAction<{ key: string; name: string }>
  ) {
    setCategory(item);
  }

  async function handleRegister(form: FormData) {
    if (!transactionType) {
      return Alert.alert("selecione o tipo da transacao ");
    }

    if (category.key === "category") {
      return Alert.alert("selecione a categoria ");
    }

    const newTransaction = {
      id: uuid.v4(),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    };

    try {
      const dataKey = `@gofinances:transactions_user:${user.id}`;
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      if (currentData) {
        AsyncStorage.setItem(
          dataKey,
          JSON.stringify([...currentData, newTransaction])
        );
      } else {
        AsyncStorage.setItem(dataKey, JSON.stringify([newTransaction]));
      }

      setCategory({
        key: "category",
        name: "Categoria",
      });
      setTransactionType("");
      reset();

      navigation.navigate("Listagem");
    } catch (error) {
      console.log(error);
      Alert.alert("não foi possivel salvar");
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              control={control}
              name={"name"}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              control={control}
              name={"amount"}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <TransactionTypes>
              <TransactionTypeButton
                title="Entrada"
                type={Types.positive}
                isActive={transactionType === Types.positive}
                onPress={() => handleTransactionTypeSelect(Types.positive)}
              />
              <TransactionTypeButton
                title="Saida"
                type={Types.negative}
                isActive={transactionType === Types.negative}
                onPress={() => handleTransactionTypeSelect(Types.negative)}
              />
            </TransactionTypes>

            <CategorySelectButton
              category={category.name}
              onPress={handleOpenCategoryModal}
            />
          </Fields>

          <Button title={"enviar"} onPress={handleSubmit(handleRegister)} />
        </Form>
        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={handleSelectCategory}
            closeSelectCategory={handleCloseCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
