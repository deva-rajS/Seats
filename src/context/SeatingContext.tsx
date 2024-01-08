import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import SeatsioClient from '@seatsio/seatsio-react-native';
import Region from '@seatsio/seatsio-react-native';
import firestore from '@react-native-firebase/firestore';
import RazorpayCheckout from 'react-native-razorpay';

interface SeatInfo {
  label: string;
  seat: string;
  ticketType: string;
  price: string;
}

interface PricingCategory {
  category: number;
  ticketTypes: PricingTicketType[];
}

interface PricingTicketType {
  ticketType: string;
  price: number;
}
interface EventColData {
  endTime: number;
  description: string;
  name: string;
  tz: string;
  venue: {
    id: string;
    name: string;
    city: string;
    image: string;
  };
  isDraft: boolean;
  startTime: number;
  image: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
}

export interface SeatingContextProps {
  eventKey: string;
  selectedTicket: SeatInfo[];
  setSelectedTicket: React.Dispatch<React.SetStateAction<SeatInfo[]>>;
  pricingData: any[];
  setPricingData: React.Dispatch<React.SetStateAction<any[]>>;
  showTermsModal: boolean;
  setShowTermsModal: React.Dispatch<React.SetStateAction<boolean>>;
  submit: boolean;
  setSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  chartRef: React.MutableRefObject<any>;
  Client: {
    holdTokens: {
      create: () => Promise<{holdToken: string}>;
    };
    events: {
      hold: (
        eventKey: string,
        seats: string[],
        holdToken: string,
      ) => Promise<void>;
    };
  };
  showTermsModalHandler: () => void;
  hideTermsModalHandler: () => void;
  price: number;
  setPrice: Dispatch<SetStateAction<number>>;
  data: any[];
  setData: Dispatch<SetStateAction<any[]>>;
  promoCode: string;
  onChangePromoCode: Dispatch<SetStateAction<string>>;
  promoApplied: Boolean;
  setPromoApplied: Dispatch<SetStateAction<boolean>>;
  eventColData: EventColData;
  seatsCount: any[];
  setSeatsCount: Dispatch<SetStateAction<any[]>>;
}

// Create a context
export const SeatingContext = createContext<SeatingContextProps | null>(null);

// Create a SeatingProvider component
export const SeatingProvider: React.FC = ({children}) => {
  const [selectedTicket, setSelectedTicket] = useState<SeatInfo[]>([]);
  const [pricingData, setPricingData] = useState<any[]>([]);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [submit, setSubmit] = useState(false);
  const eventKey = '85607055-4e5e-41c9-9c2a-5328d3cc0c25';
  const chartRef = useRef<any>(null);
  const [price, setPrice] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [promoCode, onChangePromoCode] = useState<string>('');
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [eventColData, setEventColData] = useState<any>(null);
  const [seatsCount, setSeatsCount] = useState<any[]>([]);
  const Client = {
    holdTokens: {
      create: async () => {
        return {holdToken: 'mockHoldToken'};
      },
    },
    events: {
      hold: async (eventKey: string, seats: string[], holdToken: string) => {
        console.log(
          `Holding seats ${seats.join(
            ', ',
          )} for event ${eventKey} with hold token ${holdToken}`,
        );
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await firestore()
          .collection('EventTicketCollection')
          .get();
        const EventCollection = await firestore()
          .collection('EventCollection')
          .get();

        const EventCollectiondData = EventCollection.docs.map(doc => ({
          ...doc.data(),
        }));
        const fetchedData = querySnapshot.docs.map(doc => ({
          ...doc.data().pricing,
        }));

        const newPricingData = Object.keys(fetchedData[0]).map(categoryKey => {
          const category = fetchedData[0][categoryKey];
          return {
            label: category.label,
            category: category.id,
            sort: category.sort,
            description: category.description,
            price: category.price && category.price,
            ticketTypes: category.ticketTypes && category.ticketTypes,
          };
        });
        setPricingData(newPricingData);
        setEventColData(...EventCollectiondData);

        // console.log('fetched Data', JSON.stringify(pricingData));
        // console.log('Event Data', JSON.stringify(EventCollectiondData));

        // console.log('ETC', JSON.stringify(querySnapshot));
        // const newPricingData = fetchedData.reduce(
        //   (accumulator, {pricing, ...rest}) => {
        //     const flattenedPricing = pricing.keys(subjects).map(
        //       ({ticketTypes, ...categoryRest}) => ({
        //         ...rest,
        //         ...categoryRest,
        //         ticketTypes: ticketTypes.map(({...ticketTypeRest}) => ({
        //           ...ticketTypeRest,
        //         })),
        //       }),
        //     );

        //     return [...accumulator, ...flattenedPricing];
        //   },
        //   [],
        // );
        // setPricingData(fetchedData);
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      }
    };

    fetchData();
  }, []);

  const showTermsModalHandler = () => {
    setShowTermsModal(true);
  };

  const hideTermsModalHandler = () => {
    setShowTermsModal(false);
  };

  // Value to be provided by the context
  const contextValue: SeatingContextProps = {
    eventKey,
    selectedTicket,
    setSelectedTicket,
    pricingData,
    setPricingData,
    showTermsModal,
    setShowTermsModal,
    submit,
    setSubmit,
    chartRef,
    Client,
    showTermsModalHandler,
    hideTermsModalHandler,
    price,
    setPrice,
    data,
    setData,
    promoCode,
    onChangePromoCode,
    promoApplied,
    setPromoApplied,
    eventColData,
    seatsCount,
    setSeatsCount,
  };

  return (
    <SeatingContext.Provider value={contextValue}>
      {children}
    </SeatingContext.Provider>
  );
};
