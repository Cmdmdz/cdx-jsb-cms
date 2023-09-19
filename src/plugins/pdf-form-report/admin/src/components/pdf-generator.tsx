import React, {useEffect, useState} from "react";
import {Button} from "@strapi/design-system";
import styled from "styled-components";
import {BsFillFileEarmarkPdfFill} from "react-icons/bs";
import {
  Document,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
  Font,
  Svg,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import {useCMEditViewDataManager} from "@strapi/helper-plugin";
import * as dayjs from "dayjs";
import "dayjs/locale/th";

dayjs.locale("th");

Font.registerHyphenationCallback((word) => [word]);
Font.registerEmojiSource({
  format: "png",
  url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/",
});
Font.register({
  family: "NotoSansThai",
  fonts: [
    {
      src: "/fonts/NotoSansThai-Bold.ttf",
      fontStyle: "normal",
      fontWeight: "bold",
    },
    {
      src: "/fonts/NotoSansThai-Medium.ttf",
      fontStyle: "normal",
      fontWeight: 500,
    },
    {
      src: "/fonts/NotoSansThai-Regular.ttf",
      fontStyle: "normal",
      fontWeight: 400,
    },
    {
      src: "/fonts/NotoSansThai-SemiBold.ttf",
      fontStyle: "normal",
      fontWeight: 600,
    },
  ],
});

const ButtonStyled = styled(Button)`
  width: 100%;
  display: flex;
  justify-items: center;
  height: 40px;

  span {
    display: flex;
    gap: 10px;
    align-items: center;

    svg {
      width: 14px;
      height: auto;
    }
  }
`;

// const Absolute = styled.div`
//   display: none;
//   position: absolute;
//   left: 0;
//   top: 0;
//   z-index: 999999;
//   margin: auto;
//   max-width: 90vw;
// `;

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSansThai",
    padding: 30,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    marginBottom: 10,
    wordBreak: 'break-all',
    flexDirection: "row",
    flexWrap: "wrap",
  },
  truncate: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "100%",
  },
  image: {
    height: 200,
    marginBottom: 15,
    objectFit: "contain",
  },
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
  },
  evidenceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
    justifyContent: "center",
  },
  evidenceItem: {
    width: "45%",
  },
});

interface Data {
  id: number;
  callback_agreement: boolean;
  contact: string | null;
  createdAt: string;
  gambling_type: [{ label: string; id: number }];
  gambling_type_others: string | null;
  inviter: [{ label: string; id: number }];
  inviter_others: string | null;
  tunnel: [{ label: string; id: number }];
  tunnel_others: string | null;
  type: [{ label: string; id: number }];
  website_url: string;
  damage_value: number;
  description: string;
  period: [{ label: string; id: number }];
  reason: [{ label: string; id: number }];
  cause: [{ label: string; id: number }];
  cause_other: string
  reason_other: string
  evidences: Record<string, any>[];
}

const PDFGenerator = () => {
  const {slug, initialData} = useCMEditViewDataManager();
  // console.log({ slug, initialData, allLayoutData });

  const {
    id,
    contact,
    website_url,
    description,
    damage_value,
    callback_agreement,
    evidences,
    gambling_type_others,
    inviter_others,
    tunnel_others,
    type,
    gambling_type,
    tunnel,
    inviter,
    period,
    createdAt,
    reason,
    cause,
    cause_other,
    reason_other,

  } = (initialData || {}) as Partial<Data>;

  const data = {
    contact,
    website_url,
    description,
    damage_value,
    callback_agreement,
    evidences,
    type: type?.[0],
    gambling_type: gambling_type?.[0],
    inviter: inviter?.[0],
    tunnel: tunnel?.[0],
    gambling_type_others,
    inviter_others,
    tunnel_others,
    cause_other,
    reason_other,
    period: period?.[0],
    reason: reason?.[0],
    cause: cause?.[0],
    createdAt,
  };

  const fileName = `${id}_${data.type ? "แจ้งเบาะแส" : "ร้องเรียนพนัน"}.pdf`;

  if (slug !== "api::form.form") return null;

  const maxImagesPerPage = 4;
  const pages = Math.ceil((data.evidences?.length || 0) / maxImagesPerPage);

  const WrapText = ({text}: { text?: string }) => (
    <View style={styles.value}>
      {text?.match(/\w+|\W+/g)?.map((seg, i) => (
        <Text key={i}>{seg}</Text>
      ))}
    </View>
  );

  return (
    <PDFDownloadLink
      document={
        <Document>
          {Array.from({length: pages}).map((_, index) => (
            <Page size="A4" style={styles.page} key={index}>
              {index === 0 ? (
                <>
                  <View style={styles.header}>
                    <Text style={styles.title}>
                      ข้อมูลการ
                      {data.type?.id === 1 ? "แจ้งเบาะแส" : "ร้องเรียนพนัน"}
                    </Text>
                  </View>
                  <View style={styles.infoGrid}>
                    <View
                      style={{
                        ...styles.section,
                        maxWidth: "70%",
                      }}
                    >
                      <Text style={styles.label}>URL เว็บไซต์ที่กระทำความผิด..</Text>
                      <Text
                        style={{
                          ...styles.value,
                          ...styles.truncate,
                        }}
                        wrap
                      >
                        {data.website_url}
                      </Text>
                      {data.damage_value && data.damage_value > 0 ? <>
                        <Text style={styles.label}>มูลค่าความเสียหาย</Text>
                        <Text style={styles.value}>
                          {Number(data.damage_value || 0).toLocaleString()} บาท
                        </Text>
                      </> : null}
                    </View>
                    <View style={styles.section}>
                      <Text style={styles.label}>
                        {data.type?.id === 1 ? "เบาะแส" : "ร้องเรียนพนัน"}
                        เมื่อ
                      </Text>
                      <Text style={styles.value}>
                        {dayjs(data.createdAt).format("DD / MMM / YYYY เวลา HH:mm")}
                      </Text>
                      <Text style={styles.label}>อนุญาติให้ติดต่อกลับ</Text>
                      <Text style={{...styles.value, textDecoration: "underline"}}>
                        {data.callback_agreement ? "อนุญาติ" : "ไม่อนุญาติ"}
                      </Text>
                      {data.contact && (
                        <>
                          <Text style={styles.label}>📞 โทร</Text>
                          <Text style={styles.value}>{data.contact}</Text>
                        </>
                      )}
                    </View>

                    {data.type?.id === 1 ? <></> :
                      <>
                        <View style={{...styles.section, width: "100%"}}>
                          <Text style={styles.label} wrap>
                            ระยะเวลาที่เล่นพนัน
                          </Text>
                          <WrapText text={data.period?.label}/>
                        </View>
                      </>
                    }

                    <View style={{...styles.section, width: "100%"}}>
                      <Text style={styles.label} wrap>
                        รายละเอียด
                        {data.type?.id === 1 ? "เบาะแส" : "การร้องเรียนพนัน"}
                      </Text>
                      <WrapText text={data.description}/>
                    </View>


                    <View style={{...styles.section, width: "100%"}}>
                      <Text style={styles.label}>ประเภทพนัน</Text>
                      <WrapText text={data.gambling_type?.label}/>
                      {data.gambling_type_others && (
                        <WrapText text={data.gambling_type_others}/>
                      )}
                    </View>
                    <View style={{...styles.section, width: "100%"}}>
                      <Text style={styles.label}>ถูกชักชวนจาก</Text>
                      <Text style={styles.value}>{data.inviter?.label}</Text>
                      {data.inviter_others && (
                        <WrapText text={data.inviter_others}/>
                      )}
                    </View>
                    <View style={{...styles.section, width: "100%"}}>
                      <Text style={styles.label}>ช่องทางการชักชวน</Text>
                      <Text style={styles.value}>{data.tunnel?.label}</Text>
                      {data.tunnel_others && (
                        <WrapText text={data.tunnel_others}/>
                      )}
                    </View>

                    {data.type?.id === 1 ? <></> :
                      <>
                        <View style={{...styles.section, width: "100%"}}>
                          <Text style={styles.label}>เหตุผลที่เข้าไปเล่นการพนันออนไลน์</Text>
                          {data.reason_other ? (
                            <WrapText text={data.reason_other}/>
                          ) : <>
                            <WrapText text={data.reason?.label}/>
                          </>}
                        </View>

                        <View style={{...styles.section, width: "100%"}}>
                          <Text style={styles.label}>สาเหตุที่เลือกเว็บพนันเว็บไซต์นี้</Text>
                          {data.cause_other ? (
                            <WrapText text={data.cause_other}/>
                          ) : (
                            <WrapText text={data.cause?.label}/>
                          )}
                        </View>
                      </>
                    }
                  </View>
                </>
              ) : null}

              <View style={styles.section} wrap={false}>
                <Text style={styles.title}>หลักฐาน</Text>
                <View style={styles.evidenceContainer}>
                  {data.evidences
                    ?.slice(
                      index * maxImagesPerPage,
                      (index + 1) * maxImagesPerPage
                    )
                    .map((evidence) => (
                      <View key={evidence.id} style={styles.evidenceItem}>
                        <Image src={evidence.url} style={styles.image}/>
                      </View>
                    ))}
                </View>
              </View>
            </Page>
          ))}
        </Document>
      }
      fileName={fileName}
    >
      {({loading}) => (
        <ButtonStyled
          loading={loading}
          // variant="tertiary"
          startIcon={
            <BsFillFileEarmarkPdfFill style={{width: 16, height: 16}}/>
          }
        >
          <div>ดาวน์โหลดไฟล์ PDF</div>
        </ButtonStyled>
      )}
    </PDFDownloadLink>
  );
};

export default PDFGenerator;
