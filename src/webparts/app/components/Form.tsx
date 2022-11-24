import * as React from 'react';
import { Formik, FormikHelpers, Form, FormikState, FormikProps, prepareDataForValidation } from 'formik';
import {
  ShimmeredDetailsList,
  IconButton,
  SelectionMode,
  IColumn,
  ActionButton,
  Panel,
  PanelType,
} from '@fluentui/react';
import { useAtom } from 'jotai';
import { useBoolean } from '@fluentui/react-hooks';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import SubmitButton from '../Controls/SubmitButton';
import { IClient } from '../Models/IClient';
import { FormDataSchema } from '../Schemas/FormDataSchema';
import { ProductDataSchema } from '../Schemas/ProductDataSchema';
import itemsAtom from '../Stores/MainStore';
import { clientDefaultData, productDefaultData } from '../Constants/FormDefaultValue';
import formSettingsAtom from '../Stores/FormStore';
import { FormView } from '../Models/IFormSettings';
import { isNumber } from 'lodash';
import ClientForm from '../Client/ClientForm';
import ClientSubmitButton from '../Client/ClientSubmitButton';
import { IItemAddResult, sp } from '@pnp/sp/presets/all'
import { IProducts } from '../Models/IProducts';
import clientAtom from '../Stores/ClientStore';
import productsAtom from '../Stores/MainStore';
import ProductsForm from '../Products/ProductsForm';
import AddProductButton from '../Products/ProductsSubmitButton';
import ClientSaveKonceptButton from '../Client/ClientSaveKonceptButton';
import atomStatusShp from '../Stores/StatusStore';
import CheckPermissions from './Permissions';
import { v4 as uuidv4 } from 'uuid';
import { getItemStyles } from 'office-ui-fabric-react/lib/components/ContextualMenu/ContextualMenu.classNames';
import EditProductButton from '../Products/ProductsEditButton';
import * as strings from 'AppWebPartStrings';
import { DefaultButton } from 'office-ui-fabric-react';
import styles from './App.module.scss';
initializeIcons(/* optional base url */);
/*
 * to-do
 * doriešiť loading screen ked fetchujem permission/item - DONE
 * fixnut upload json tabulky
 *
*/
interface IAppProps {
  context: any;
}
export default function Form2(props: IAppProps) {
  // ------------------------------------------------------------- CONST DECLARATION ---------------------------------------------------------------------
  // const [items, setItems] = useAtom(itemsAtom);
  // const [products, setProducts] = useAtom(productsAtom);
  const [products, setProducts] = React.useState(undefined);
  const [client, setClient] = useAtom(clientAtom);
  const [isOpenNew, { setTrue: openPanelNew, setFalse: dismissPanelNew }] = useBoolean(false);
  const [isOpenEdit, { setTrue: openPanelEdit, setFalse: dismissPanelEdit }] = useBoolean(false);
  const [settings, setSettings] = useAtom(formSettingsAtom);
  const [statusShp, setStatusShp] = useAtom(atomStatusShp);
  const [shpData, setShpData] = React.useState(clientDefaultData)
  const [editItem, setEditItem] = React.useState(undefined);
  const [hasPermission, setHasPermission] = React.useState(false);
  const [loading, setLoading] = React.useState({
    gettingPermission: true,
    gettingItem: true
  })
  let itemToEdit: IProducts = {};

  // --------------------------------------------------------------- LIFE CYCLE ----------------------------------------------------------------------

  React.useEffect(() => {
    // setLoading(true);
    setProducts([]);
    console.log("zistujem params");
    const queryParams = new UrlQueryParameterCollection(window.location.href);
    const id = queryParams.getValue("id");
    const view = queryParams.getValue("view");
    if (view && id) {
      if (typeof view === 'string' && isNumber(+id)) {
        console.log("view:", view, "id:", +id)
        setSettings({
          view: view as FormView,
          itemId: +id,
        });
      } else {
        console.error(`One of those params are not valid`);
        console.error(`id`, id);
        console.error(`view`, view);
      }
    }
    // takto sa má používať await v useEffect
    const asyncCheck = async () => {
      await CheckPermissions(view)
        .then(result => {
          setHasPermission(result);
          // setLoading({gettingPermission: false, gettingItem: true})
          setLoading((prev) => {return {...prev, gettingPermission: false}})
        });
    };
    asyncCheck().catch(console.error);
    console.log("ready");
  }, [])

  React.useEffect(() => {
    console.log("useEffect(): hasPermission:", hasPermission);
    console.log("useEffect(): loading.gettingPermission:", loading.gettingPermission);
    //console.log("useEffect(): settings.view", settings.view);

    if (hasPermission && !loading.gettingPermission) {
      console.log("user je oprávnený");
      const asyncGetItem = async () => {
        await getItem(settings.itemId).then(() => setLoading((prev) => {return {...prev, gettingItem: false}}));
      }
      if ((settings.view === "display" || "edit" || "admin") && settings.itemId) {
        asyncGetItem().catch(console.error);
      }
    } else if (!hasPermission && !loading.gettingPermission) {
      console.log("Užívateľ nemá práva!");
      //window.location.href = "https://rbinternational.sharepoint.com/sites/tbsk-esg-int";
    }
  }, [hasPermission, settings, loading.gettingPermission]);
  React.useEffect(() => { 
    if(products) {
      console.log("useEffect():", products.length, "products:", products) 
    }
  }, [products])

  {/* --------------------------------------------------------------- TABLE HANDLERS ---------------------------------------------------------------------- */ }
  const editRecord = React.useCallback((item: IProducts) => {
    setEditItem(item);
    openPanelEdit();
  }, [products, openPanelEdit]);

  const editRecord1 = React.useCallback((item: IProducts) => {
    // const id = event.currentTarget.getAttribute('data-id');
    // itemToEdit = products.filter((prevItem) => prevItem.productId === id)
    itemToEdit = item;

    console.log("item", item)
    console.log("itemToEdit", itemToEdit)
    openPanelEdit();
  }, [products, openPanelEdit]);

  const editProduct = React.useCallback((item: IProducts) => {
    console.log("edited item:", item);
    setProducts(prevState => {
      const newState = prevState.map(obj => {
        if (obj.productId === item.productId) {
          return { ...obj, productName: item.productName, productNote: item.productNote, productPayment: item.productPayment, productStatus: item.productStatus };
        }
        return obj;
      });

      return newState;
    });

    dismissPanelEdit();
    console.log("editoval som produkt");
  }, [products, dismissPanelEdit]);

  const addNewProduct = React.useCallback(
    async (values: IProducts, formikHelpers: FormikHelpers<IProducts>) => {
      setEditItem(undefined);
      values = { ...values, productId: uuidv4(), productStatus: "Nespracovaný" }
      console.log("values", values);

      setProducts((prevItems) => {
        return [...prevItems, values];
      });
      //console.log(products[0].productName)
      formikHelpers.resetForm();

      dismissPanelNew();
      console.log("pridal som produkt");
      // }, [products]
    }, [dismissPanelNew, products]
  );

  const removeRecord = React.useCallback(
    (event: any) => {
      const id = event.currentTarget.getAttribute('data-id');
      console.log("mažem:", id); 
      setProducts((prevItems) =>
        prevItems.filter((prevItem) => prevItem.productId !== id)
      );
    },
    [products]
  );
  const handleOpenPanel = () => {
    setEditItem(undefined);
    openPanelNew();
  }
  {/* --------------------------------------------------------------- TABLE INIT ---------------------------------------------------------------------- */ }
  const onRenderEdit = React.useCallback((item: IProducts) => {
    return (
      <div className="row" data-selection-invoke="true">
        <IconButton
          key={item.productId}
          data-id={item.productId}
          data={String(item)}
          aria-label={"Edit"}
          iconProps={{ iconName: 'Edit' }}
          onClick={() => editRecord(item)}
          // onClick={editRecord}
        />
      </div>
    );
  }, [products]);
  const onRenderDelete = React.useCallback((item: IProducts) => {
    return (
      <div className="row" data-selection-invoke="true">
        <IconButton
          key={item.productId}
          data-id={item.productId}
          aria-label="Delete"
          iconProps={{ iconName: 'Delete' }}
          onClick={removeRecord}
          disabled={settings.view === "display" || settings.view === "edit"}
        // disabled={true}
        />
      </div>
    );
  }, [settings.view]);
  const columns: IColumn[] = React.useMemo(() => {
    return [
      {
        key: 'productId',
        name: 'ID Produktu',
        fieldName: 'productId',
        minWidth: 80,
        maxWidth: 200,
        isResizable: true,
        isCollapsable: false,
      },
      {
        key: 'productName',
        name: 'Názov Produktu',
        fieldName: 'productName',
        minWidth: 80,
        maxWidth: 200,
        isResizable: true,
        isCollapsable: false,
      },
      {
        key: 'productNote',
        name: 'Poznámka k Produktu',
        fieldName: 'productNote',
        minWidth: 160,
        maxWidth: 200,
        isResizable: true,
        isCollapsable: false,
      },
      {
        key: 'productPayment',
        name: 'Platba Produktu',
        fieldName: 'productPayment',
        minWidth: 80,
        maxWidth: 200,
        isResizable: true,
        isCollapsable: false,
      },
      {
        key: 'edit',
        name: '',
        fieldName: 'edit',
        minWidth: 30,
        maxWidth: 30,
        isCollapsable: false,
        isResizable: false,
        onRender: onRenderEdit,
      },
      {
        key: 'remove',
        name: '',
        fieldName: 'remove',
        minWidth: 30,
        maxWidth: 30,
        isCollapsable: false,
        isResizable: false,
        onRender: onRenderDelete,
      },
    ];
  }, [products]);
  {/* --------------------------------------------------------------- SHAREPOINT HANDLERS ---------------------------------------------------------------------- */ }
  sp.setup({
    spfxContext: props.context
  });
  const getItem = React.useCallback(async (id: number) => {
    console.log("skúšam getnúť item");
    try {
      await sp.web.lists.getByTitle("ProduktyTest").items.getById(id).get().then((result) => setShpData(result))
      await sp.web.lists.getByTitle("ProduktyTest").items.getById(id).select("produkty").get().then((result) => setProducts(JSON.parse(result.produkty)))
    } catch (error) {
      console.error("getItems(): error:", error)
    }
  }, [shpData, setShpData]);
  const createNewItem = React.useCallback(
    async (values: IClient) => {
      console.log("----------------------")
      console.log("creating this shp item:")
      console.log("statusShp:", statusShp);
      console.log("client values:", values);
      console.log("useEffect():", products.length, "products:", products);
      console.log("----------------------")
      await sp.web.lists.getByTitle("ProduktyTest").items.add({
        Title: values.Title,
        priezvisko: values.priezvisko,
        rodneCislo: values.rodneCislo,
        datumNarodenia: values.datumNarodenia,
        ulica: values.ulica,
        mesto: values.mesto,
        psc: values.psc,
        okres: values.okres,
        telCislo: values.telCislo,
        produkty: JSON.stringify(products),
        status: statusShp,
      })
        .catch(() => {
          alert(strings.Error)
        })
        .then(() => {
          if (statusShp === "Pošli") {
            alert(strings.SHPSentOK)
            // window.location.href = "https://rbinternational.sharepoint.com/sites/tbsk-esg-int/Lists/ProduktyTest/AllItems.aspx";
          } else if (statusShp === "Koncept") {
            alert(strings.SHPSavedOK)
            // window.location.href = "https://rbinternational.sharepoint.com/sites/tbsk-esg-int/Lists/ProduktyTest/AllItems.aspx";
          }
        });
    }, [client, statusShp, products]
  );
  const submittedForm = React.useCallback(
    async (values: IClient, formikHelpers: FormikHelpers<IClient>) => {
      //console.log(statusShp);
      //console.log(values);
      setClient((prevItems) => {
        return { ...prevItems, values };
      });
      // console.log(client.meno) // nefunguje
      await createNewItem(values);
      // formikHelpers.resetForm();
      // dismissPanel();
      console.log("over");
    },
    // [dismissPanel, createNewItem, client]
    [client, statusShp]
  );
  const saveAsAdmin = React.useCallback(
    async (values: IClient) => {
      console.log(values);
      console.log(statusShp);
      await sp.web.lists.getByTitle("ProduktyTest").items.add({
        Title: values.Title,
        priezvisko: values.priezvisko,
        rodneCislo: values.rodneCislo,
        datumNarodenia: values.datumNarodenia,
        ulica: values.ulica,
        mesto: values.mesto,
        psc: values.psc,
        okres: values.okres,
        telCislo: values.telCislo,
        produkty: JSON.stringify(products),
        status: statusShp,
      })
        .catch(() => {
          alert(strings.Error)
        })
        .then(() => {
          if (statusShp === "Pošli") {
            alert(strings.SHPSentOK)
            window.location.href = "https://rbinternational.sharepoint.com/sites/tbsk-esg-int/Lists/ProduktyTest/AllItems.aspx";
          } else if (statusShp === "Koncept") {
            alert(strings.SHPSavedOK)
            window.location.href = "https://rbinternational.sharepoint.com/sites/tbsk-esg-int/Lists/ProduktyTest/AllItems.aspx";
          }
        });
    }, [client, statusShp]
  );
  const debugButt = () => {
    console.log("debug");
  }
  {/* ------------------------------------------------------------------- RENDER ---------------------------------------------------------------------- */ }
  if (loading.gettingItem && loading.gettingPermission || !hasPermission) 
    return <div style={{textAlign: "center"}}><img src={require('./loading2.gif') } alt="načítavam" width="30" height="30" /></div>
  return (
    <div>
      <h1>ESG form, typ zobrazenia: {settings.view}</h1>

      <Formik
        //initialValues={(settings.view === "new" && clientFormInitialValues) || (settings.view === "edit" && shpData)}
        initialValues={clientDefaultData}
        validationSchema={FormDataSchema}
        onSubmit={submittedForm}
      >
        {() => (
          <Form>
            {/* --------------------------------------------------------------- CLIENT FORM ---------------------------------------------------------------------- */}
            <ClientForm props={shpData} /><br />
            {/* ak dám submit bez toho aby som loosol focus tak vypíše len jednu error message, tam kde je focus */}
            <ClientSubmitButton />
            <ClientSaveKonceptButton />
            <button type="button" onClick={() => { console.log(products) }}>debug</button>
            {/* <button type="button" onClick={debugButt}>debug</button> */}
            {/* {settings.view === "admin" &&
              <ActionButton onClick={saveAsAdmin}>Uložiť ako Admin</ActionButton>
            } */}
          </Form>
        )}
      </Formik>

      {/* --------------------------------------------------------------- PANEL NEW ---------------------------------------------------------------------- */}
      <Panel
        isOpen={isOpenNew}
        onDismiss={dismissPanelNew}
        // onOuterClick={() => console.log("outside click")} nefunguje
        headerText="Pridať nový produkt"
        closeButtonAriaLabel="Close"
        type={PanelType.medium}
      >
        <Formik
          initialValues={productDefaultData}
          validationSchema={ProductDataSchema}
          onSubmit={addNewProduct}
        >
          {() => (
            <Form>
              {/* --------------------------------------------------------------- NEW PRODUCT FORM ---------------------------------------------------------------------- */}
              <ProductsForm editItem={editItem}/>
              <br />
              <AddProductButton />
            </Form>
          )}
        </Formik>
        {/* --------------------------------------------------------------- PANEL EDIT ---------------------------------------------------------------------- */}
      </Panel>
      <Panel
        isOpen={isOpenEdit}
        onDismiss={dismissPanelEdit}
        // headerText={(!editing && "Pridať nový produkt") || (editing && "Editovať produkt")}
        headerText="Editovať produkt"
        closeButtonAriaLabel="Close"
        type={PanelType.medium}
      >
        <Formik
          initialValues={productDefaultData}
          validationSchema={ProductDataSchema}
          onSubmit={editProduct}
        >
          {() => (
            <Form>
              {/* --------------------------------------------------------------- EDIT PRODUCT FORM ---------------------------------------------------------------------- */}
              {/* <ProductsForm editItem={editItem} /> */}
              <ProductsForm editItem={editItem} />
              <br />
              <EditProductButton />
            </Form>
          )}
        </Formik>
      </Panel>
      {/* --------------------------------------------------------------- PRODUCT LIST ---------------------------------------------------------------------- */}
      <ShimmeredDetailsList
        items={products || []}
        columns={columns}
        selectionMode={SelectionMode.none}
        enableShimmer={!products}
      // onItemInvoked={removeItem}
      ></ShimmeredDetailsList>
      {/* --------------------------------------------------------------- ADD PRODUCT BUTTON ---------------------------------------------------------------------- */}
      <ActionButton
        iconProps={{ iconName: 'Add' }}
        allowDisabledFocus
        onClick={handleOpenPanel}
        text="Pridať Produkt"
        disabled={settings.view === "display" || settings.view === "edit"}
      />
    </div>
  );
}