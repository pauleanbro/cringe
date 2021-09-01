import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import useImage from 'use-image';

import { signIn, signOut, useSession, } from 'next-auth/client';

const Stage = dynamic(() => import('react-konva').then((module) => module.Stage), { ssr: false })
const Layer = dynamic(() => import('react-konva').then((module) => module.Layer), { ssr: false })
const Text = dynamic(() => import('react-konva').then((module) => module.Text), { ssr: false })
const Rect = dynamic(() => import('react-konva').then((module) => module.Rect), { ssr: false })
const Group = dynamic(() => import('react-konva').then((module) => module.Group), { ssr: false })
const Ellipse = dynamic(() => import('react-konva').then((module) => module.Ellipse), { ssr: false })

export default function Home() {
  const [session] = useSession();
  const [ttPic, setTTPic] = useState(null);

  const [template] = useImage('https://i.imgur.com/GFbXAC2.png');
  const [profile_pic] = useImage(ttPic);

  const [username, setUsername] = useState('macacto');

  let usernameFontSize = 70;

  useEffect(() => {
    if (session) {
      setTTPic(session.user.image);

      fetch('/api/twitter', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(session)
      }).then(res => res.json())
        .then(res => {
          setUsername(res.username);
        }
      )
    }
  }, [session]);

  return (
    <div>
      <Head>
        <title>Cringeco</title>
      </Head>
      <h1>Cringeco</h1>
      {session && <button onClick={() => signOut()}>Sair</button>}
      {!session &&
        <div>
          <p>You are not signed in</p>
          <button onClick={() => signIn()}>Login</button>
        </div>
      }
      {session &&
        <Stage width={700} height={250}>
          <Layer>
            <Group>
              <Rect
                x={0}
                y={0}
                width={700}
                height={250}
                fillPatternImage={template}
              />
              <Ellipse
                x={575}
                y={125}
                width={200}
                height={200}
                fillPatternImage={profile_pic}
                fillPatternRepeat="no-repeat"
                fillPatternScaleX={230 / 400}
                fillPatternScaleY={230 / 400}
                fillPatternX={-100}
                fillPatternY={-100}
              />
              <Text
                x={50}
                y={50}
                text={username}
                width={400}
                fontFamily="Impact"
                fill="#CBA45B"
                sceneFunc={(context, shape) => {
                  do {
                    context.font = `${usernameFontSize -= 15}px Impact`;
                  } while (context.measureText(username).width > shape.width() - 100);

                  context.fillStyle = shape.fill();
                  context.fillText(shape.text(), shape.x() - 50, shape.y());

                }}
              />
              <Text
                x={50}
                y={120}
                text="é 100% cringe"
                fontSize={50}
                fontFamily="Impact"
                fill="white"
              />
            </Group>
          </Layer>
        </Stage>
      }
    </div>
  )
}
