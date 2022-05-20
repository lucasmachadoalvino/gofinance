import React, { useState } from "react";
import { ActivityIndicator, Alert, Platform } from "react-native";
import {
  Container,
  Header,
  TitleWrapper,
  SignInTitle,
  Footer,
  Title,
  FooterWrapper,
} from "./styles";

import AppleSvg from "../../assets/apple.svg";
import GoogleSvg from "../../assets/google.svg";
import LogoSvg from "../../assets/logo.svg";
import { RFValue } from "react-native-responsive-fontsize";
import { SignSocialButton } from "../../components/SignSocialButton";
import { useAuth } from "../../hooks/auth";
import { useTheme } from "styled-components";

export function Signin() {
  const [isLoading, setIsLoading] = useState(false);

  const { signInWithGoogle, signInWithApple } = useAuth();

  const theme = useTheme();

  async function handleSignInWithGoogle() {
    try {
      setIsLoading(true);
      return await signInWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possivel conectar com a conta google");
      setIsLoading(false);
    }
  }

  async function handleSignInWithApple() {
    try {
      setIsLoading(true);
      return await signInWithApple();
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possivel conectar com a conta Apple");
      setIsLoading(false);
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />

          <Title>{`Controle suas\nfinanças de forma\nmuito simples`}</Title>
        </TitleWrapper>

        <SignInTitle>Faça seu login com uma das contas abaixo</SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignSocialButton
            title={"Entrar com Google"}
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />
          {Platform.OS === "ios" && (
            <SignSocialButton
              title={"Entrar com Apple"}
              svg={AppleSvg}
              onPress={handleSignInWithApple}
            />
          )}
        </FooterWrapper>

        {isLoading && (
          <ActivityIndicator
            color={theme.colors.shape}
            style={{ marginTop: 18 }}
          />
        )}
      </Footer>
    </Container>
  );
}
