'use client'

import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { motion, useScroll, useAnimation } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Button, Card, CardBody, Tooltip } from '@nextui-org/react'
import { ArrowRight, CheckCircle, Users, Calendar, Clock } from 'lucide-react'
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google'

import { NavbarDemo } from './components/navbar'
import { ImagesSliderDemo } from './components/carousel'
import { TimelineDemo } from './components/about'

export default function Home() {
  return (
    <div>
      <NavbarDemo/>
      <ImagesSliderDemo/>
      <TimelineDemo/>
    </div>
  )
}