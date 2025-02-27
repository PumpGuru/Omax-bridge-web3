declare module "aos" {
    interface AOSOptions {
      duration?: number;
      easing?: string;
      once?: boolean;
      offset?: number;
    }
  
    const AOS: {
      init(options?: AOSOptions): void;
      refresh(): void;
    };
  
    export default AOS;
  }
  declare module 'react-marquee' {
    const Marquee: React.ComponentType<any>;
    export default Marquee;
  }
  
  