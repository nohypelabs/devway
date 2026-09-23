import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Universal',
    Svg: require('@site/static/img/devway-universal.svg').default,
    description: (
      <>
        Satu standar arsitektur untuk <b>semua stack</b> — React, Vue, Next.js,
        Express, Django, Laravel, Go, atau vanilla JS. Hanya implementasi
        teknis yang berbeda.
      </>
    ),
  },
  {
    title: 'Pragmatis',
    Svg: require('@site/static/img/devway-pragmatic.svg').default,
    description: (
      <>
        Mulai dari <b>Level 1</b> (CRUD sederhana). Naik ke <b>Level 2</b>{' '}
        (state machine + events) hanya kalau benar-benar butuh. Anti
        over-engineering.
      </>
    ),
  },
  {
    title: 'Decoupled & Maintainable',
    Svg: require('@site/static/img/devway-decoupled.svg').default,
    description: (
      <>
        Backend Hexagonal (Ports & Adapters) + DDD, frontend{' '}
        <b>feature-based</b> dengan composition root. Dependency rule ketat,
        mudah dirawat & diskalakan.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
