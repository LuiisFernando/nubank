import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

import Header from '~/components/Header';
import Tabs from '~/components/Tabs';
import Menu from '~/components/Menu';

import {
  Container, Content, Card, CardHeader, CardContent, Title, Description, CardFooter, Annotation,
} from './styles';

export default function Main() {
  let offset = 0;

  // Animated.Value is used to gain performace
  const translateY = new Animated.Value(0);

  // on animated event happen setting translate with value of translationY
  const animatedEvent = Animated.event(
    [
      {
        nativeEvent: {
          // translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true }, // used to gain performace as well
  );

  function onHandlerStateChanged(event) {
    //  if old state is equals active
    if (event.nativeEvent.oldState === State.ACTIVE) {
      let opened = false;

      // extract translationY from event.nativeEvent
      const { translationY } = event.nativeEvent;

      // sum the pixel of translationY
      offset += translationY;

      // if swipe down more than 100px then swipe down till max px allowed that is 380px
      if (translationY >= 100) {
        opened = true;
      } else {
        // set offset when offset is < than 100 and setOffset to 0 of translateY, then timing set 0 and make animation
        translateY.setValue(offset);
        translateY.setOffset(0); // set 0 to translateY
        offset = 0;
      }

      Animated.timing(translateY, {
        toValue: opened ? 380 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        offset = opened ? 380 : 0; // if opened set 380 else set 0
        translateY.setOffset(offset); // set offset
        translateY.setValue(0); // set 0 to translateY
      });
    }
  }

  return (
    <Container>
      <Header />

      <Content>
        <Menu translateY={translateY} />

        <PanGestureHandler
          onGestureEvent={animatedEvent}
          onHandlerStateChange={onHandlerStateChanged}
        >
          <Card style={{
            transform: [{
              translateY: translateY.interpolate({
                inputRange: [-350, 0, 380], // if I  swipe up -350 only move -10 up, zero, if swipe down 380 move 380 down
                outputRange: [-10, 0, 380],
                extrapolate: 'clamp', // don't let me extrapolate the screen
              }),
            }],
          }}
          >
            <CardHeader>
              <Icon name="attach-money" size={28} color="#666" />
              <Icon name="visibility-off" size={28} color="#666" />
            </CardHeader>
            <CardContent>
              <Title>Saldo disponível</Title>
              <Description>R$ 197.611,65</Description>
            </CardContent>
            <CardFooter>
              <Annotation>
                Transfêrencia de R$: 20,00 recebida de J4CKCORP hoje às 06:00h
              </Annotation>
            </CardFooter>
          </Card>
        </PanGestureHandler>

      </Content>

      <Tabs translateY={translateY} />
    </Container>
  );
}
